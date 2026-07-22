import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mocks = vi.hoisted(() => ({ generateAi: vi.fn() }));

vi.mock("@/platform/ai/generate-ai.server", () => ({
  generateAi: mocks.generateAi,
}));

import { generateVideoAi } from "@/features/videos/provider/generate-video-ai.server";

describe("generateVideoAi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ALLOW_VIDEO_AI_PROVIDER_TESTS = "true";
  });

  afterEach(() => {
    delete process.env.ALLOW_VIDEO_AI_PROVIDER_TESTS;
  });

  it("falls back to an ungrounded request when optional grounding fails", async () => {
    mocks.generateAi
      .mockRejectedValueOnce(new Error("Grounding failed"))
      .mockResolvedValueOnce({ output: { title: "Ready" }, references: [] });

    await expect(
      generateVideoAi("System", "Prompt", z.object({ title: z.string() })),
    ).resolves.toEqual({ output: { title: "Ready" }, references: [] });

    expect(mocks.generateAi).toHaveBeenCalledTimes(2);
    expect(mocks.generateAi).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ searchGrounding: true }),
    );
    expect(mocks.generateAi).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ searchGrounding: false }),
    );
  });

  it("does not retry configuration and quota errors", async () => {
    mocks.generateAi.mockRejectedValue(
      Object.assign(new Error("Quota exceeded"), { statusCode: 429 }),
    );

    await expect(
      generateVideoAi("System", "Prompt", z.object({ title: z.string() })),
    ).rejects.toThrow("Gemini quota is temporarily exhausted");
    expect(mocks.generateAi).toHaveBeenCalledOnce();
  });
});
