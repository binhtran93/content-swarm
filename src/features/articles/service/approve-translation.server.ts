import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function approveTranslation(
  projectId: string,
  articleId: string,
  locale: string,
): Promise<void> {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const project = firestore.collection("projects").doc(projectId);
  const articleReference = project.collection("articles").doc(articleId);
  const translationReference = articleReference
    .collection("translations")
    .doc(locale);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const [articleSnapshot, translationSnapshot] = await Promise.all([
      transaction.get(articleReference),
      transaction.get(translationReference),
    ]);
    const article = readFirestoreDocument(
      articleDocumentSchema,
      articleSnapshot,
    );
    const translation = readFirestoreDocument(
      translationDocumentSchema,
      translationSnapshot,
    );
    if (!article || !translation)
      throw new ArticleServiceError(
        "unavailable",
        "Translation is unavailable.",
      );
    if (article.status === "archived")
      throw new ArticleServiceError(
        "archived",
        "Translations under archived articles cannot be approved.",
      );
    if (locale === article.locale || !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(locale))
      throw new ArticleServiceError(
        "invalid",
        "Translation locale is invalid.",
      );
    const validation = validateArticleMdx(translation.content);
    if (!validation.valid)
      throw new ArticleServiceError("invalid", validation.errors[0]!);
    const slugReference = project
      .collection("articleSlugs")
      .doc(`${locale}--${translation.slug}`);
    const reservation = await transaction.get(slugReference);
    if (reservation.exists && reservation.data()?.articleId !== articleId)
      throw new ArticleServiceError(
        "conflict",
        "This locale already uses that slug.",
      );
    transaction.set(slugReference, {
      schemaVersion: 1,
      articleId,
      locale,
      slug: translation.slug,
      updatedAt: Timestamp.now(),
    });
    transaction.update(translationReference, {
      status: "approved",
      updatedAt: Timestamp.now(),
    });
  });
}
