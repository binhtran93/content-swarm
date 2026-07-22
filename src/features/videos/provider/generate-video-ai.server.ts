import "server-only";

import type { ZodType } from "zod";

import { VideoServiceError } from "@/features/videos/service/video-service-error";
import {
  generateAi,
  type AiGeneration,
} from "@/platform/ai/generate-ai.server";

export async function generateVideoAi<T>(
  system: string,
  prompt: string,
  schema: ZodType<T>,
): Promise<AiGeneration<T>> {
  if (
    process.env.NODE_ENV === "test" &&
    process.env.ALLOW_VIDEO_AI_PROVIDER_TESTS !== "true"
  )
    throw new VideoServiceError(
      "provider",
      "AI network calls are disabled during tests.",
    );
  const request = (searchGrounding: boolean) =>
    generateAi({
      system,
      prompt,
      outputSchema: schema,
      outputName: "quick_list_video",
      searchGrounding,
      timeoutMs: 240_000,
    });

  try {
    return await request(true);
  } catch (error) {
    const terminalMessage = providerErrorMessage(error);
    if (terminalMessage)
      throw new VideoServiceError("provider", terminalMessage);

    try {
      return await request(false);
    } catch (retryError) {
      const retryMessage = providerErrorMessage(retryError);
      if (retryMessage) throw new VideoServiceError("provider", retryMessage);
    }

    throw new VideoServiceError(
      "provider",
      "Gemini could not produce a valid storyboard. Try a shorter or more specific video idea.",
    );
  }
}

function providerErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "AI_NOT_CONFIGURED")
    return "AI generation is not configured.";
  if (message === "AI_UNSUPPORTED_PROVIDER")
    return "The configured AI provider is not supported.";

  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? error.statusCode
      : undefined;
  if (status === 401 || status === 403)
    return "Gemini rejected the configured API key or project permissions.";
  if (status === 404)
    return "The configured Gemini model is unavailable. Check GEMINI_MODEL.";
  if (status === 429)
    return "Gemini quota is temporarily exhausted. Wait briefly or check the API quota.";
  return null;
}
