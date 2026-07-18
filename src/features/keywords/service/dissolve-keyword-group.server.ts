import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { readKeywordDocuments } from "@/features/keywords/service/group-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function dissolveKeywordGroup(projectId: string, groupId: string) {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const groupReference = projectReference
    .collection("keywordGroups")
    .doc(groupId);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const group = readFirestoreDocument(
      keywordGroupDocumentSchema,
      await transaction.get(groupReference),
    );
    if (!group)
      throw new KeywordServiceError(
        "unavailable",
        "Keyword group is unavailable.",
      );
    const references = group.memberKeywordIds.map((id) =>
      projectReference.collection("keywords").doc(id),
    );
    const keywords = await readKeywordDocuments(transaction, references);
    if (keywords.some((keyword) => keyword.articleId)) {
      throw new KeywordServiceError(
        "assigned",
        "An assigned group cannot be dissolved.",
      );
    }
    const now = Timestamp.now();
    references.forEach((reference) =>
      transaction.update(reference, { groupId: null, updatedAt: now }),
    );
    transaction.delete(groupReference);
  });
}
