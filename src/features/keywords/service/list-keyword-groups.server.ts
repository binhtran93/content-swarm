import "server-only";

import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import type { KeywordGroup } from "@/features/keywords/model/keyword";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listKeywordGroups(
  projectId: string,
): Promise<KeywordGroup[]> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywordGroups")
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(keywordGroupDocumentSchema, item);
    return document
      ? [
          {
            groupId: item.id,
            name: document.name,
            primaryKeywordId: document.primaryKeywordId,
            memberKeywordIds: document.memberKeywordIds,
            createdAt: document.createdAt.toDate().toISOString(),
            updatedAt: document.updatedAt.toDate().toISOString(),
          },
        ]
      : [];
  });
}
