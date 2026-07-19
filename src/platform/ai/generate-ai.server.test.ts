import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mocks = vi.hoisted(() => ({
  generateText: vi.fn(),
  googleModel: vi.fn((id: string) => ({ provider: "google", id })),
  googleSearch: vi.fn(() => ({ type: "google-search" })),
}));

vi.mock("ai", async () => {
  const actual = await vi.importActual<typeof import("ai")>("ai");
  return { ...actual, generateText: mocks.generateText };
});
vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: () =>
    Object.assign(mocks.googleModel, {
      tools: { googleSearch: mocks.googleSearch },
    }),
}));

import { generateAi } from "@/platform/ai/generate-ai.server";

describe("generateAi", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "gemini-key";
    mocks.generateText.mockResolvedValue({
      output: "Generated text",
      text: "Generated text",
      sources: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.AI_PROVIDER;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("uses Gemini by default", async () => {
    await expect(generateAi({ prompt: "Write something" })).resolves.toEqual({
      output: "Generated text",
      references: [],
    });
    expect(mocks.googleModel).toHaveBeenCalledWith("gemini-3.5-flash");
    expect(mocks.generateText).toHaveBeenCalledOnce();
  });

  it("uses an explicitly configured model", async () => {
    process.env.GEMINI_MODEL = "gemini-custom";

    await generateAi({ prompt: "Write something" });

    expect(mocks.googleModel).toHaveBeenCalledWith("gemini-custom");
  });

  it("returns schema output directly", async () => {
    mocks.generateText.mockResolvedValue({
      output: { title: "Structured" },
      text: '{"title":"Structured"}',
      sources: [],
    });

    await expect(
      generateAi({
        prompt: "Return a title",
        outputSchema: z.object({ title: z.string() }),
        outputName: "title_result",
      }),
    ).resolves.toEqual({ output: { title: "Structured" }, references: [] });
  });

  it("enables Google Search and returns unique URL references", async () => {
    mocks.generateText.mockResolvedValue({
      output: "Grounded text",
      sources: [
        {
          sourceType: "url",
          id: "one",
          title: "Official source",
          url: "https://example.com/facts",
        },
        {
          sourceType: "url",
          id: "duplicate",
          title: "Duplicate",
          url: "https://example.com/facts",
        },
      ],
    });

    await expect(
      generateAi({ prompt: "Research this", searchGrounding: true }),
    ).resolves.toEqual({
      output: "Grounded text",
      references: [
        { title: "Official source", url: "https://example.com/facts" },
      ],
    });

    expect(mocks.googleSearch).toHaveBeenCalledWith({});
    expect(mocks.generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: {
          google_search: { type: "google-search" },
        },
      }),
    );
  });

  it("rejects unsupported global configuration", async () => {
    process.env.AI_PROVIDER = "unsupported";

    await expect(generateAi({ prompt: "Write something" })).rejects.toThrow(
      "AI_UNSUPPORTED_PROVIDER",
    );
    expect(mocks.generateText).not.toHaveBeenCalled();
  });
});
