import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import {
  quickListVideoProposalSchema,
  type QuickListVideoProposal,
} from "@/features/videos/model/quick-list-video";
import { videoDocumentSchema } from "@/features/videos/model/video-document";
import { renderVideoLocally } from "@/features/videos/rendering/render-video-locally.server";
import { getVideo } from "@/features/videos/service/get-video.server";
import { VideoServiceError } from "@/features/videos/service/video-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

function sanitizeError(error: unknown) {
  return (error instanceof Error ? error.message : "Local rendering failed.")
    .replace(/[\r\n]+/g, " ")
    .slice(0, 300);
}

export async function approveAndRenderVideo(
  projectId: string,
  videoId: string,
  value: QuickListVideoProposal,
) {
  const proposal = quickListVideoProposalSchema.parse(value);
  const video = await getVideo(projectId, videoId);
  if (video.status === "rendering")
    throw new VideoServiceError("render", "This video is already rendering.");
  const reference = getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("videos")
    .doc(videoId);
  await reference.update({
    approvedProposal: proposal,
    status: "rendering",
    outputPath: null,
    coverPath: null,
    lastError: null,
    updatedAt: Timestamp.now(),
  });
  try {
    const rendered = await renderVideoLocally(projectId, video, proposal);
    const current = videoDocumentSchema.parse((await reference.get()).data());
    await reference.update({
      status: "ready",
      outputPath: rendered.outputPath,
      coverPath: rendered.coverPath,
      lastError: null,
      updatedAt: Timestamp.now(),
    });
    return { ...current, ...rendered, status: "ready" as const };
  } catch (error) {
    await reference.update({
      status: "failed",
      lastError: sanitizeError(error),
      updatedAt: Timestamp.now(),
    });
    if (error instanceof VideoServiceError) throw error;
    throw new VideoServiceError(
      "render",
      "The local video render failed. You can retry without regenerating the storyboard.",
    );
  }
}
