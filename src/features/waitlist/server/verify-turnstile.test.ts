import { afterEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstile } from "@/features/waitlist/server/verify-turnstile.server";

describe("verifyTurnstile", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepts a successful single-use waitlist token", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ success: true, action: "waitlist_signup" }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyTurnstile("token", "secret")).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST", cache: "no-store" }),
    );
  });

  it.each([
    { success: false, action: "waitlist_signup" },
    { success: true, action: "another_action" },
  ])("rejects an invalid or mismatched response", async (payload) => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(payload), { status: 200 }),
        ),
    );
    await expect(verifyTurnstile("token", "secret")).resolves.toBe(false);
  });

  it("fails closed when Cloudflare is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(verifyTurnstile("token", "secret")).resolves.toBe(false);
  });
});
