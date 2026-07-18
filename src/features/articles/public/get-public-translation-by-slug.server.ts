import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { Translation } from "@/features/articles/model/translation";
import { toTranslation } from "@/features/articles/service/to-translation.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getPublicTranslationBySlug(
  projectId: string,
  locale: string,
  slug: string,
): Promise<Translation | null> {
  const project = getServerFirestore().collection("projects").doc(projectId);
  const reservation = await project
    .collection("articleSlugs")
    .doc(`${locale}--${slug}`)
    .get();
  const articleId = reservation.data()?.articleId;
  if (typeof articleId !== "string") return null;
  const articleReference = project.collection("articles").doc(articleId);
  const [articleSnapshot, translationSnapshot] = await Promise.all([
    articleReference.get(),
    articleReference.collection("translations").doc(locale).get(),
  ]);
  const article = readFirestoreDocument(articleDocumentSchema, articleSnapshot);
  const translation = readFirestoreDocument(
    translationDocumentSchema,
    translationSnapshot,
  );
  if (
    !article ||
    article.status !== "published" ||
    !translation ||
    translation.status !== "approved" ||
    translation.slug !== slug
  )
    return null;
  return toTranslation(locale, translation);
}
