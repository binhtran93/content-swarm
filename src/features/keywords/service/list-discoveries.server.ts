import "server-only";

import { keywordDiscoveryDocumentSchema } from "@/features/keywords/model/keyword-discovery-document";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import { toKeywordDiscovery } from "@/features/keywords/service/to-keyword-discovery.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listDiscoveries(
  projectId: string,
): Promise<KeywordDiscovery[]> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywordDiscoveries")
    .orderBy("createdAt", "desc")
    .limit(25)
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(
      keywordDiscoveryDocumentSchema,
      item,
    );
    return document ? [toKeywordDiscovery(item.id, document)] : [];
  });
}
