import "server-only";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import type { ZodType } from "zod";

const providers = {
  gemini: {
    apiKeyEnvironment: "GEMINI_API_KEY",
    modelEnvironment: "GEMINI_MODEL",
    defaultModel: "gemini-3.5-flash",

    createRuntime(apiKey: string, modelName: string) {
      const client = createGoogleGenerativeAI({ apiKey });

      return {
        model: client(modelName),
        searchTools: {
          google_search: client.tools.googleSearch({}),
        },
      };
    },
  },
} as const;

export type AiProvider = keyof typeof providers;

type GenerateAiInput<T> = {
  prompt: string;
  system?: string;

  provider?: AiProvider;
  model?: string;

  outputSchema?: ZodType<T>;
  outputName?: string;
  searchGrounding?: boolean;

  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
};

export type AiReference = {
  title: string;
  url: string;
};

export type AiGeneration<T> = {
  output: T;
  references: AiReference[];
};

export async function generateAi<T = string>(
  input: GenerateAiInput<T>,
): Promise<AiGeneration<T>> {
  const provider = configuredProvider(input.provider);
  const configuration = providers[provider];

  const modelName =
    input.model?.trim() ||
    process.env[configuration.modelEnvironment]?.trim() ||
    configuration.defaultModel;

  const apiKey = requiredEnvironment(configuration.apiKeyEnvironment);
  const runtime = configuration.createRuntime(apiKey, modelName);

  const result = await generateText({
    model: runtime.model,
    system: input.system,
    prompt: input.prompt,
    output: createOutput(input.outputSchema, input.outputName),
    tools: input.searchGrounding ? runtime.searchTools : undefined,
    temperature: input.temperature,
    maxOutputTokens: input.maxOutputTokens,
    abortSignal: AbortSignal.timeout(input.timeoutMs ?? 120_000),
  });

  return {
    output: result.output as T,
    references: normalizeReferences(result.sources),
  };
}

function normalizeReferences(
  sources: Awaited<ReturnType<typeof generateText>>["sources"],
): AiReference[] {
  const references = sources.flatMap((source) => {
    if (source.sourceType !== "url") return [];

    try {
      const url = new URL(source.url);
      const title = source.title?.trim() || url.hostname.replace(/^www\./, "");

      return [{ title, url: url.toString() }];
    } catch {
      return [];
    }
  });

  return references.filter(
    (reference, index) =>
      references.findIndex((item) => item.url === reference.url) === index,
  );
}

function configuredProvider(explicit?: AiProvider): AiProvider {
  if (explicit) return explicit;

  const provider = process.env.AI_PROVIDER?.trim() || "gemini";
  if (Object.hasOwn(providers, provider)) return provider as AiProvider;

  throw new Error("AI_UNSUPPORTED_PROVIDER");
}

function createOutput<T>(schema?: ZodType<T>, name?: string) {
  if (schema) return Output.object({ schema, name });

  return Output.text();
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("AI_NOT_CONFIGURED");

  return value;
}
