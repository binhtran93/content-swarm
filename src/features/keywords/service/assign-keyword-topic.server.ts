import "server-only";

import { Timestamp, type Transaction } from "firebase-admin/firestore";

import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { readKeywordDocuments } from "@/features/keywords/service/group-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function assignKeywordTopic(
  transaction: Transaction,
  ownerId: string,
  projectId: string,
  topicId: string,
  articleId: string,
): Promise<string[]> {
  await assertActiveProject(transaction, projectId, ownerId);
  const [kind, id] = topicId.split(":", 2);
  if (!id || (kind !== "keyword" && kind !== "group")) {
    throw new KeywordServiceError(
      "unavailable",
      "Article topic is unavailable.",
    );
  }
  const projectReference = getServerFirestore()
    .collection("projects")
    .doc(projectId);
  let ids: string[];
  if (kind === "group") {
    const group = readFirestoreDocument(
      keywordGroupDocumentSchema,
      await transaction.get(
        projectReference.collection("keywordGroups").doc(id),
      ),
    );
    if (!group)
      throw new KeywordServiceError(
        "unavailable",
        "Article topic is unavailable.",
      );
    ids = group.memberKeywordIds;
  } else ids = [id];

  const references = ids.map((keywordId) =>
    projectReference.collection("keywords").doc(keywordId),
  );
  const keywords = await readKeywordDocuments(transaction, references);
  if (keywords.some((keyword) => keyword.articleId)) {
    throw new KeywordServiceError(
      "conflict",
      "Article topic is already assigned.",
    );
  }
  if (kind === "keyword" && keywords[0]?.groupId) {
    throw new KeywordServiceError(
      "conflict",
      "Choose the complete keyword group.",
    );
  }
  const now = Timestamp.now();
  references.forEach((reference) =>
    transaction.update(reference, { articleId, updatedAt: now }),
  );
  return ids;
}
