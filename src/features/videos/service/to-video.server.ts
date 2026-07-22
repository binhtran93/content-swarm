import "server-only";

import type { z } from "zod";

import type { QuickListVideo } from "@/features/videos/model/quick-list-video";
import type { videoDocumentSchema } from "@/features/videos/model/video-document";

export function toVideo(
  videoId: string,
  document: z.infer<typeof videoDocumentSchema>,
): QuickListVideo {
  return {
    videoId,
    prompt: document.prompt,
    sourceMode: document.sourceMode,
    locale: document.locale,
    narrationEnabled: document.narrationEnabled,
    voiceGender: document.voiceGender,
    assets: document.assets,
    approvedProposal: document.approvedProposal,
    status: document.status,
    outputPath: document.outputPath,
    coverPath: document.coverPath,
    lastError: document.lastError,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
