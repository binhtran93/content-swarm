import "server-only";

import { keywordDiscoveryDocumentSchema } from "@/features/keywords/model/keyword-discovery-document";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { toKeywordDiscovery } from "@/features/keywords/service/to-keyword-discovery.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getDiscovery(
  projectId: string,
  discoveryId: string,
): Promise<KeywordDiscovery> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywordDiscoveries")
    .doc(discoveryId)
    .get();
  const document = readFirestoreDocument(
    keywordDiscoveryDocumentSchema,
    snapshot,
  );
  if (!document)
    throw new KeywordServiceError("unavailable", "Discovery is unavailable.");
  return toKeywordDiscovery(snapshot.id, document);
}
