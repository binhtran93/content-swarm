import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mocks = vi.hoisted(() => ({
  generateText: vi.fn(),
  googleModel: vi.fn((id: string) => ({ provider: "google", id })),
  googleSearch: vi.fn(() => ({ type: "google-search" })),
  openaiModel: vi.fn((id: string) => ({ provider: "openai", id })),
  openaiSearch: vi.fn(() => ({ type: "openai-search" })),
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
vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => ({
    responses: mocks.openaiModel,
    tools: { webSearch: mocks.openaiSearch },
  }),
}));

import { generateAi } from "@/platform/ai/generate-ai.server";

describe("generateAi", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "gemini-key";
    process.env.OPENAI_API_KEY = "openai-key";
    mocks.generateText.mockResolvedValue({
      output: "Generated text",
      text: "Generated text",
      sources: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_MODEL;
    delete process.env.OPENAI_MODEL;
  });

  it("defaults to Gemini and accepts Google-specific grounding options", async () => {
    const result = await generateAi({
      prompt: "What changed?",
      providerOptions: {
        googleSearch: true,
        thinking: { level: "low", includeThoughts: false },
      },
    });

    expect(mocks.googleModel).toHaveBeenCalledWith("gemini-3.5-flash");
    expect(mocks.googleSearch).toHaveBeenCalledOnce();
    expect(mocks.generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: { google_search: { type: "google-search" } },
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: undefined,
              thinkingLevel: "low",
              includeThoughts: false,
            },
          },
        },
      }),
    );
    expect(result).toMatchObject({
      output: "Generated text",
      provider: "gemini",
      model: "gemini-3.5-flash",
    });
  });

  it("routes explicit OpenAI models and Responses API options", async () => {
    await generateAi({
      provider: "openai",
      model: "gpt-5-mini",
      prompt: "Write something",
      providerOptions: {
        responses: { reasoningEffort: "low", textVerbosity: "low" },
        webSearch: { searchContextSize: "low" },
      },
    });

    expect(mocks.openaiModel).toHaveBeenCalledWith("gpt-5-mini");
    expect(mocks.openaiSearch).toHaveBeenCalledWith({
      searchContextSize: "low",
    });
    expect(mocks.generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        providerOptions: {
          openai: { reasoningEffort: "low", textVerbosity: "low" },
        },
      }),
    );
  });

  it("returns schema-validated structured output", async () => {
    mocks.generateText.mockResolvedValue({
      output: { title: "Structured" },
      text: '{"title":"Structured"}',
      sources: [],
    });
    const result = await generateAi({
      prompt: "Return a title",
      outputSchema: z.object({ title: z.string() }),
      outputName: "title_result",
    });
    expect(result.output).toEqual({ title: "Structured" });
  });

  it("rejects incompatible Gemini thinking settings before calling AI", async () => {
    await expect(
      generateAi({
        prompt: "Think",
        providerOptions: {
          thinking: { budget: 100, level: "low" },
        },
      }),
    ).rejects.toThrow("AI_INVALID_PROVIDER_OPTIONS");
    expect(mocks.generateText).not.toHaveBeenCalled();
  });
});
