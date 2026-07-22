import "server-only";

import type { QuickListVideo } from "@/features/videos/model/quick-list-video";
import { videoDocumentSchema } from "@/features/videos/model/video-document";
import { toVideo } from "@/features/videos/service/to-video.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listVideos(projectId: string): Promise<QuickListVideo[]> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("videos")
    .orderBy("updatedAt", "desc")
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(videoDocumentSchema, item);
    return document ? [toVideo(item.id, document)] : [];
  });
}
