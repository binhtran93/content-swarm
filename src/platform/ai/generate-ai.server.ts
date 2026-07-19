import "server-only";

import {
  createGoogleGenerativeAI,
  type GoogleLanguageModelOptions,
} from "@ai-sdk/google";
import {
  createOpenAI,
  type OpenAIResponsesProviderOptions,
} from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import type { ZodType } from "zod";

export type AiProvider = "gemini" | "openai";

type GeminiOptions = {
  googleSearch?: boolean;
  thinking?: {
    budget?: number;
    level?: "minimal" | "low" | "medium" | "high";
    includeThoughts?: boolean;
  };
};

type OpenAIWebSearchOptions = NonNullable<
  Parameters<ReturnType<typeof createOpenAI>["tools"]["webSearch"]>[0]
>;

type OpenAIOptions = {
  responses?: OpenAIResponsesProviderOptions;
  webSearch?: boolean | OpenAIWebSearchOptions;
};

type ProviderInput =
  | {
      provider?: undefined;
      model?: string;
      providerOptions?: never;
    }
  | {
      provider: "gemini";
      model?: string;
      providerOptions?: GeminiOptions;
    }
  | {
      provider: "openai";
      model?: string;
      providerOptions?: OpenAIOptions;
    };

type SharedInput<T> = {
  system?: string;
  prompt: string;
  outputSchema?: ZodType<T>;
  outputName?: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
};

type AiResult<T> = {
  output: T;
  text: string;
  sources: { id: string; url: string; title?: string }[];
  provider: AiProvider;
  model: string;
};

export async function generateAi<T = string>(
  input: SharedInput<T> & ProviderInput,
): Promise<AiResult<T>> {
  const provider = configuredProvider(input.provider);
  const model =
    input.model?.trim() ||
    (provider === "gemini"
      ? process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash"
      : process.env.OPENAI_MODEL?.trim() || "gpt-5-mini");
  const output = input.outputSchema
    ? Output.object({
        schema: input.outputSchema,
        name: input.outputName,
      })
    : Output.text();

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("AI_NOT_CONFIGURED");
    const providerOptions =
      input.provider === "gemini" ? input.providerOptions : undefined;
    const thinking = providerOptions?.thinking;
    if (thinking?.budget !== undefined && thinking.level !== undefined)
      throw new Error("AI_INVALID_PROVIDER_OPTIONS");
    const google = createGoogleGenerativeAI({ apiKey });
    const googleOptions: GoogleLanguageModelOptions = {
      thinkingConfig: thinking
        ? {
            thinkingBudget: thinking.budget,
            thinkingLevel: thinking.level,
            includeThoughts: thinking.includeThoughts,
          }
        : undefined,
    };
    const result = await generateText({
      model: google(model),
      system: input.system,
      prompt: input.prompt,
      output,
      temperature: input.temperature,
      maxOutputTokens: input.maxOutputTokens,
      abortSignal: AbortSignal.timeout(input.timeoutMs ?? 120_000),
      providerOptions: { google: googleOptions },
      tools: providerOptions?.googleSearch
        ? { google_search: google.tools.googleSearch({}) }
        : undefined,
    });
    return resultValue(result, provider, model);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");
  const openai = createOpenAI({ apiKey });
  const providerOptions =
    input.provider === "openai" ? input.providerOptions : undefined;
  const webSearch = providerOptions?.webSearch;
  const result = await generateText({
    model: openai.responses(model),
    system: input.system,
    prompt: input.prompt,
    output,
    temperature: input.temperature,
    maxOutputTokens: input.maxOutputTokens,
    abortSignal: AbortSignal.timeout(input.timeoutMs ?? 120_000),
    providerOptions: { openai: providerOptions?.responses ?? {} },
    tools: webSearch
      ? {
          web_search: openai.tools.webSearch(
            typeof webSearch === "boolean" ? {} : webSearch,
          ),
        }
      : undefined,
  });
  return resultValue(result, provider, model);
}

function configuredProvider(provider?: AiProvider): AiProvider {
  if (provider) return provider;
  const configured = process.env.AI_PROVIDER?.trim() || "gemini";
  if (configured === "gemini" || configured === "openai") return configured;
  throw new Error("AI_UNSUPPORTED_PROVIDER");
}

function resultValue<T>(
  result: {
    output: unknown;
    text: string;
    sources: Array<{
      sourceType: string;
      id: string;
      url?: string;
      title?: string;
    }>;
  },
  provider: AiProvider,
  model: string,
): AiResult<T> {
  return {
    output: result.output as T,
    text: result.text,
    sources: result.sources.flatMap((source) =>
      source.sourceType === "url" && source.url
        ? [
            {
              id: source.id,
              url: source.url,
              ...(source.title ? { title: source.title } : {}),
            },
          ]
        : [],
    ),
    provider,
    model,
  };
}
