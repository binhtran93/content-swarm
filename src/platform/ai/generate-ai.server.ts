import "server-only";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import type { ZodType } from "zod";

const providers = {
  gemini: {
    apiKeyEnvironment: "GEMINI_API_KEY",
    modelEnvironment: "GEMINI_MODEL",
    defaultModel: "gemini-3.5-flash",

    createModel(apiKey: string, model: string) {
      return createGoogleGenerativeAI({ apiKey })(model);
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

  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
};

export async function generateAi<T = string>(
  input: GenerateAiInput<T>,
): Promise<T> {
  const provider = configuredProvider(input.provider);
  const configuration = providers[provider];

  const modelName =
    input.model?.trim() ||
    process.env[configuration.modelEnvironment]?.trim() ||
    configuration.defaultModel;

  const apiKey = requiredEnvironment(configuration.apiKeyEnvironment);
  const model = configuration.createModel(apiKey, modelName);

  const result = await generateText({
    model,
    system: input.system,
    prompt: input.prompt,
    output: createOutput(input.outputSchema, input.outputName),
    temperature: input.temperature,
    maxOutputTokens: input.maxOutputTokens,
    abortSignal: AbortSignal.timeout(input.timeoutMs ?? 120_000),
  });

  return result.output as T;
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
