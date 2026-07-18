import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import type { KeywordGroup } from "@/features/keywords/model/keyword";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import {
  createGroupDocument,
  readKeywordDocuments,
  selectPrimaryKeywordId,
  validateGroupKeywords,
  validateGroupSelection,
  validateMergedMemberIds,
} from "@/features/keywords/service/group-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function createKeywordGroup(
  projectId: string,
  selectedIds: string[],
): Promise<KeywordGroup> {
  const owner = await requireOwner();
  const selection = validateGroupSelection(selectedIds);
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const groupReference = projectReference.collection("keywordGroups").doc();
  const selectedKeywordReferences = selection.map((id) =>
    projectReference.collection("keywords").doc(id),
  );

  const document = await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const selectedKeywords = await readKeywordDocuments(
      transaction,
      selectedKeywordReferences,
    );
    const sourceGroupIds = [
      ...new Set(
        selectedKeywords.flatMap((keyword) =>
          keyword.groupId ? [keyword.groupId] : [],
        ),
      ),
    ];
    const sourceGroupReferences = sourceGroupIds.map((groupId) =>
      projectReference.collection("keywordGroups").doc(groupId),
    );
    const sourceGroups = sourceGroupReferences.length
      ? await transaction.getAll(...sourceGroupReferences)
      : [];
    const groupedMemberIds = sourceGroups.flatMap((snapshot) => {
      const group = readFirestoreDocument(keywordGroupDocumentSchema, snapshot);
      if (!group)
        throw new KeywordServiceError(
          "unavailable",
          "A selected keyword group is unavailable.",
        );
      return group.memberKeywordIds;
    });
    const ids = validateMergedMemberIds([...selection, ...groupedMemberIds]);
    const keywordReferences = ids.map((id) =>
      projectReference.collection("keywords").doc(id),
    );
    const keywords = await readKeywordDocuments(transaction, keywordReferences);
    validateGroupKeywords(keywords, new Set(sourceGroupIds));
    const primaryId = selectPrimaryKeywordId(ids, keywords);
    const next = createGroupDocument(primaryId, ids, null);
    transaction.create(groupReference, next);
    keywordReferences.forEach((reference) =>
      transaction.update(reference, {
        groupId: groupReference.id,
        updatedAt: next.updatedAt,
      }),
    );
    sourceGroupReferences.forEach((reference) => transaction.delete(reference));
    return next;
  });

  return {
    groupId: groupReference.id,
    name: document.name,
    primaryKeywordId: document.primaryKeywordId,
    memberKeywordIds: document.memberKeywordIds,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
