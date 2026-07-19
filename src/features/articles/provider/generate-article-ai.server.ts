import "server-only";

import type { ZodType } from "zod";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import {
  generateAi,
  type AiGeneration,
} from "@/platform/ai/generate-ai.server";

type ArticleAiOptions<T> = {
  format?: { name: string; schema: ZodType<T> };
  searchGrounding?: boolean;
};

export async function generateArticleAi<T = string>(
  system: string,
  user: string,
  options: ArticleAiOptions<T> = {},
): Promise<AiGeneration<T>> {
  if (process.env.NODE_ENV === "test")
    throw new ArticleServiceError(
      "provider",
      "AI network calls are disabled during tests.",
    );
  try {
    const result = await generateAi<T>({
      system,
      prompt: user,
      outputSchema: options.format?.schema,
      outputName: options.format?.name,
      searchGrounding: options.searchGrounding ?? true,
      timeoutMs: 240_000,
    });
    if (
      !options.format &&
      typeof result.output === "string" &&
      !result.output.trim()
    )
      throw new ArticleServiceError(
        "provider",
        "AI returned no usable proposal.",
      );
    return result;
  } catch (error) {
    if (error instanceof ArticleServiceError) throw error;
    if (error instanceof Error && error.message === "AI_NOT_CONFIGURED")
      throw new ArticleServiceError(
        "provider",
        "AI generation is not configured. Manual editing remains available.",
      );
    throw new ArticleServiceError(
      "provider",
      "AI generation failed. Your saved work was not changed.",
    );
  }
}
