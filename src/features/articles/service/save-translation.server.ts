import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { TranslationInput } from "@/features/articles/model/translation";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { assertSupportedTranslationLocales } from "@/features/articles/service/assert-supported-translation-locales";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const inputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(500_000),
  seoTitle: z.string().trim().min(1).max(200),
  seoDescription: z.string().trim().min(1).max(500),
});

export async function saveTranslation(
  projectId: string,
  articleId: string,
  locale: string,
  input: TranslationInput,
): Promise<void> {
  const owner = await requireOwner();
  const value = inputSchema.parse(input);
  const validation = validateArticleMdx(value.content);
  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);
  const firestore = getServerFirestore();
  const project = firestore.collection("projects").doc(projectId);
  const articleReference = project.collection("articles").doc(articleId);
  const reference = articleReference.collection("translations").doc(locale);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const [articleSnapshot, currentSnapshot] = await Promise.all([
      transaction.get(articleReference),
      transaction.get(reference),
    ]);
    const article = readFirestoreDocument(
      articleDocumentSchema,
      articleSnapshot,
    );
    if (!article || article.status === "archived")
      throw new ArticleServiceError("unavailable", "Article is unavailable.");
    assertSupportedTranslationLocales(article.locale, locale);
    const current = readFirestoreDocument(
      translationDocumentSchema,
      currentSnapshot,
    );
    const nextReservation = project
      .collection("articleSlugs")
      .doc(`${locale}--${value.slug}`);
    let nextReservationSnapshot;
    let oldReservationSnapshot;
    if (current?.status === "approved") {
      nextReservationSnapshot = await transaction.get(nextReservation);
      if (current.slug !== value.slug) {
        oldReservationSnapshot = await transaction.get(
          project.collection("articleSlugs").doc(`${locale}--${current.slug}`),
        );
      }
      if (
        nextReservationSnapshot.exists &&
        nextReservationSnapshot.data()?.articleId !== articleId
      )
        throw new ArticleServiceError(
          "conflict",
          "This locale already uses that slug.",
        );
    }
    const now = Timestamp.now();
    if (current?.status === "approved") {
      transaction.set(nextReservation, {
        schemaVersion: 1,
        articleId,
        locale,
        slug: value.slug,
        updatedAt: now,
      });
      if (
        current.slug !== value.slug &&
        oldReservationSnapshot?.data()?.articleId === articleId
      )
        transaction.delete(
          project.collection("articleSlugs").doc(`${locale}--${current.slug}`),
        );
    }
    transaction.set(reference, {
      schemaVersion: 1,
      ...value,
      status: current?.status === "approved" ? "approved" : "draft",
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    });
  });
}
