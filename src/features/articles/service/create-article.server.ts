import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { toArticle } from "@/features/articles/service/to-article.server";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import { assignKeywordTopic } from "@/features/keywords/service/assign-keyword-topic.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function createArticle(
  projectId: string,
  keywordId: string,
  sourceLocale: string,
): Promise<Article> {
  const owner = await requireOwner();
  const locale = sourceLocale.trim();
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(locale))
    throw new Error("Choose a valid source locale.");
  const firestore = getServerFirestore();
  const articleReference = firestore
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc();
  const document = await firestore.runTransaction(async (transaction) => {
    const keyword = readFirestoreDocument(
      keywordDocumentSchema,
      await transaction.get(
        firestore
          .collection("projects")
          .doc(projectId)
          .collection("keywords")
          .doc(keywordId),
      ),
    );
    if (!keyword)
      throw new ArticleServiceError(
        "unavailable",
        "Article topic is unavailable.",
      );
    let topicId = `keyword:${keywordId}`;
    if (keyword.groupId) {
      const group = readFirestoreDocument(
        keywordGroupDocumentSchema,
        await transaction.get(
          firestore
            .collection("projects")
            .doc(projectId)
            .collection("keywordGroups")
            .doc(keyword.groupId),
        ),
      );
      if (!group || group.primaryKeywordId !== keywordId)
        throw new ArticleServiceError(
          "conflict",
          "Choose the primary keyword for the complete group.",
        );
      topicId = `group:${keyword.groupId}`;
    }
    const assignedIds = await assignKeywordTopic(
      transaction,
      owner.uid,
      projectId,
      topicId,
      articleReference.id,
    );
    if (!assignedIds.includes(keywordId))
      throw new ArticleServiceError(
        "unavailable",
        "Article topic is unavailable.",
      );
    const now = Timestamp.now();
    const next = articleDocumentSchema.parse({
      schemaVersion: 1,
      locale,
      keywordId,
      title: null,
      slug: null,
      topic: null,
      excerpt: null,
      plan: null,
      planReferences: [],
      content: null,
      contentReferences: [],
      seoTitle: null,
      seoDescription: null,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(articleReference, next);
    return next;
  });
  return toArticle(articleReference.id, document);
}
