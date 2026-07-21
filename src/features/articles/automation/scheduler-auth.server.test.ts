import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyIdToken = vi.fn();

vi.mock("google-auth-library", () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdToken;
  },
}));

describe("verifyArticleAutomationScheduler", () => {
  beforeEach(() => {
    vi.resetModules();
    verifyIdToken.mockReset();
    vi.stubEnv(
      "ARTICLE_AUTOMATION_OIDC_AUDIENCE",
      "https://example.com/api/automation/articles/run",
    );
    vi.stubEnv(
      "ARTICLE_AUTOMATION_SERVICE_ACCOUNT",
      "scheduler@example.iam.gserviceaccount.com",
    );
  });

  it("requires a bearer token", async () => {
    const { verifyArticleAutomationScheduler } =
      await import("@/features/articles/automation/scheduler-auth.server");
    await expect(verifyArticleAutomationScheduler(null)).rejects.toThrow(
      /required/,
    );
  });

  it("accepts only the configured verified service account", async () => {
    verifyIdToken.mockResolvedValue({
      getPayload: () => ({
        email: "scheduler@example.iam.gserviceaccount.com",
        email_verified: true,
        iss: "https://accounts.google.com",
      }),
    });
    const { verifyArticleAutomationScheduler } =
      await import("@/features/articles/automation/scheduler-auth.server");
    await expect(
      verifyArticleAutomationScheduler("Bearer signed-token"),
    ).resolves.toBeUndefined();
    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: "signed-token",
      audience: "https://example.com/api/automation/articles/run",
    });
  });

  it("rejects another identity", async () => {
    verifyIdToken.mockResolvedValue({
      getPayload: () => ({
        email: "other@example.iam.gserviceaccount.com",
        email_verified: true,
        iss: "https://accounts.google.com",
      }),
    });
    const { verifyArticleAutomationScheduler } =
      await import("@/features/articles/automation/scheduler-auth.server");
    await expect(
      verifyArticleAutomationScheduler("Bearer signed-token"),
    ).rejects.toThrow(/rejected/);
  });
});
