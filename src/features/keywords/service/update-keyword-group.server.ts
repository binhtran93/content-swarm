import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import type { KeywordGroup } from "@/features/keywords/model/keyword";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import {
  createGroupDocument,
  readKeywordDocuments,
  validateGroupInput,
  validateGroupKeywords,
} from "@/features/keywords/service/group-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function updateKeywordGroup(
  projectId: string,
  groupId: string,
  memberIds: string[],
  primaryId: string,
  name: string | null = null,
): Promise<KeywordGroup> {
  const owner = await requireOwner();
  const ids = validateGroupInput(memberIds, primaryId);
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const groupReference = projectReference
    .collection("keywordGroups")
    .doc(groupId);

  const document = await firestore.runTransaction(async (transaction) => {
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
    const allIds = [...new Set([...group.memberKeywordIds, ...ids])];
    const references = allIds.map((id) =>
      projectReference.collection("keywords").doc(id),
    );
    const keywords = await readKeywordDocuments(transaction, references);
    const byId = new Map(allIds.map((id, index) => [id, keywords[index]!]));
    validateGroupKeywords(
      keywords.filter((_, index) => ids.includes(allIds[index]!)),
      groupId,
    );
    if (group.memberKeywordIds.some((id) => byId.get(id)?.articleId)) {
      throw new KeywordServiceError(
        "assigned",
        "An assigned group cannot be changed.",
      );
    }

    const next = createGroupDocument(primaryId, ids, name, group.createdAt);
    transaction.set(groupReference, next);
    references.forEach((reference, index) => {
      const shouldBeMember = ids.includes(allIds[index]!);
      transaction.update(reference, {
        groupId: shouldBeMember ? groupId : null,
        updatedAt: next.updatedAt,
      });
    });
    return next;
  });

  return {
    groupId,
    name: document.name,
    primaryKeywordId: document.primaryKeywordId,
    memberKeywordIds: document.memberKeywordIds,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
