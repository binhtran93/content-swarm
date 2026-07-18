import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import {
  articleSeoInputSchema,
  type ArticleSeoInput,
} from "@/features/articles/model/article-seo-input";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function saveArticleSeo(
  projectId: string,
  articleId: string,
  input: ArticleSeoInput,
): Promise<void> {
  const owner = await requireOwner();
  const value = articleSeoInputSchema.parse(input);
  const firestore = getServerFirestore();
  const project = firestore.collection("projects").doc(projectId);
  const articleReference = project.collection("articles").doc(articleId);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const article = readFirestoreDocument(
      articleDocumentSchema,
      await transaction.get(articleReference),
    );
    if (!article)
      throw new ArticleServiceError("unavailable", "Article is unavailable.");
    if (article.status === "archived")
      throw new ArticleServiceError(
        "archived",
        "Archived articles cannot be edited.",
      );
    const nextSlugReference = project
      .collection("articleSlugs")
      .doc(`${article.locale}--${value.slug}`);
    const nextReservation = await transaction.get(nextSlugReference);
    if (
      nextReservation.exists &&
      nextReservation.data()?.articleId !== articleId
    )
      throw new ArticleServiceError(
        "conflict",
        "This locale already uses that slug.",
      );
    if (article.slug && article.slug !== value.slug) {
      const oldReference = project
        .collection("articleSlugs")
        .doc(`${article.locale}--${article.slug}`);
      const oldReservation = await transaction.get(oldReference);
      if (oldReservation.data()?.articleId === articleId)
        transaction.delete(oldReference);
    }
    transaction.set(nextSlugReference, {
      schemaVersion: 1,
      articleId,
      locale: article.locale,
      slug: value.slug,
      updatedAt: Timestamp.now(),
    });
    transaction.update(articleReference, {
      ...value,
      updatedAt: Timestamp.now(),
    });
  });
}
