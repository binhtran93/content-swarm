import "server-only";

import type { ZodType } from "zod";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { generateAi } from "@/platform/ai/generate-ai.server";

export async function generateArticleAi<T = string>(
  system: string,
  user: string,
  format?: { name: string; schema: ZodType<T> },
): Promise<T> {
  if (process.env.NODE_ENV === "test")
    throw new ArticleServiceError(
      "provider",
      "AI network calls are disabled during tests.",
    );
  try {
    const result = await generateAi<T>({
      system,
      prompt: user,
      outputSchema: format?.schema,
      outputName: format?.name,
      timeoutMs: 240_000,
    });
    if (!format && !result.text.trim())
      throw new ArticleServiceError(
        "provider",
        "AI returned no usable proposal.",
      );
    return result.output;
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
