import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";

const mocks = vi.hoisted(() => ({ generateAi: vi.fn() }));

vi.mock("@/platform/ai/generate-ai.server", () => ({
  generateAi: mocks.generateAi,
}));

describe("generateArticleAi", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    mocks.generateAi.mockReset();
    mocks.generateAi.mockResolvedValue("Proposal");
  });

  it("delegates provider selection to the shared AI gateway", async () => {
    await expect(generateArticleAi("System", "User")).resolves.toBe("Proposal");

    expect(mocks.generateAi).toHaveBeenCalledOnce();
    expect(mocks.generateAi).toHaveBeenCalledWith(
      expect.objectContaining({
        system: "System",
        prompt: "User",
        timeoutMs: 240_000,
      }),
    );
    expect(mocks.generateAi.mock.calls[0]![0]).not.toHaveProperty("provider");
    expect(mocks.generateAi.mock.calls[0]![0]).not.toHaveProperty("model");
  });
});
