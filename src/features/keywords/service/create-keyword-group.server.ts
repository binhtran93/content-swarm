import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import type { KeywordGroup } from "@/features/keywords/model/keyword";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import {
  createGroupDocument,
  readKeywordDocuments,
  validateGroupInput,
  validateGroupKeywords,
} from "@/features/keywords/service/group-keywords.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

export async function createKeywordGroup(
  projectId: string,
  memberIds: string[],
  primaryId: string,
  name: string | null = null,
): Promise<KeywordGroup> {
  const owner = await requireOwner();
  const ids = validateGroupInput(memberIds, primaryId);
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const groupReference = projectReference.collection("keywordGroups").doc();
  const keywordReferences = ids.map((id) =>
    projectReference.collection("keywords").doc(id),
  );

  const document = await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const keywords = await readKeywordDocuments(transaction, keywordReferences);
    validateGroupKeywords(keywords, null);
    const next = createGroupDocument(primaryId, ids, name);
    transaction.create(groupReference, next);
    keywordReferences.forEach((reference) =>
      transaction.update(reference, {
        groupId: groupReference.id,
        updatedAt: next.updatedAt,
      }),
    );
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
