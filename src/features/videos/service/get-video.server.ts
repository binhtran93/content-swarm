import "server-only";

import type { QuickListVideo } from "@/features/videos/model/quick-list-video";
import { videoDocumentSchema } from "@/features/videos/model/video-document";
import { VideoServiceError } from "@/features/videos/service/video-service-error";
import { toVideo } from "@/features/videos/service/to-video.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getVideo(
  projectId: string,
  videoId: string,
): Promise<QuickListVideo> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("videos")
    .doc(videoId)
    .get();
  const document = readFirestoreDocument(videoDocumentSchema, snapshot);
  if (!document)
    throw new VideoServiceError("unavailable", "Video is unavailable.");
  return toVideo(snapshot.id, document);
}
