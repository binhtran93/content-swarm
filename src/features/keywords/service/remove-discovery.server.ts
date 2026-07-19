import "server-only";

import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

export async function removeDiscovery(
  projectId: string,
  discoveryId: string,
): Promise<void> {
  await getProjectContext(projectId);

  const reference = getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywordDiscoveries")
    .doc(discoveryId);
  const snapshot = await reference.get();

  if (!snapshot.exists) {
    throw new KeywordServiceError("unavailable", "Discovery is unavailable.");
  }

  await reference.delete();
}
