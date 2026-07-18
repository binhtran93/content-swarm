import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { readKeywordDocuments } from "@/features/keywords/service/group-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function removeKeywords(projectId: string, selectedIds: string[]) {
  const selection = [...new Set(selectedIds)];
  if (selection.length === 0 || selection.length > 450) {
    throw new KeywordServiceError(
      "invalid-selection",
      "Select between 1 and 450 backlog rows to remove.",
    );
  }
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const selectedReferences = selection.map((id) =>
    projectReference.collection("keywords").doc(id),
  );

  return firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const selectedKeywords = await readKeywordDocuments(
      transaction,
      selectedReferences,
    );
    const groupIds = [
      ...new Set(
        selectedKeywords.flatMap((keyword) =>
          keyword.groupId ? [keyword.groupId] : [],
        ),
      ),
    ];
    const groupReferences = groupIds.map((groupId) =>
      projectReference.collection("keywordGroups").doc(groupId),
    );
    const groupSnapshots = groupReferences.length
      ? await transaction.getAll(...groupReferences)
      : [];
    const groupedMemberIds = groupSnapshots.flatMap((snapshot) => {
      const group = readFirestoreDocument(keywordGroupDocumentSchema, snapshot);
      if (!group)
        throw new KeywordServiceError(
          "unavailable",
          "A selected keyword group is unavailable.",
        );
      return group.memberKeywordIds;
    });
    const keywordIds = [...new Set([...selection, ...groupedMemberIds])];
    if (keywordIds.length > 450) {
      throw new KeywordServiceError(
        "invalid-selection",
        "The selected groups contain too many keywords to remove at once.",
      );
    }
    const keywordReferences = keywordIds.map((id) =>
      projectReference.collection("keywords").doc(id),
    );
    const keywords = await readKeywordDocuments(transaction, keywordReferences);
    if (keywords.some((keyword) => keyword.articleId)) {
      throw new KeywordServiceError(
        "assigned",
        "Assigned keywords cannot be removed from the backlog.",
      );
    }
    keywordReferences.forEach((reference) => transaction.delete(reference));
    groupReferences.forEach((reference) => transaction.delete(reference));
    return { removed: keywordIds.length };
  });
}
