import "server-only";

import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { Translation } from "@/features/articles/model/translation";
import { getPublicArticle } from "@/features/articles/public/get-public-article.server";
import { toTranslation } from "@/features/articles/service/to-translation.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getPublicTranslation(
  projectId: string,
  articleId: string,
  locale: string,
): Promise<Translation | null> {
  const article = await getPublicArticle(projectId, articleId);
  if (!article) return null;
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId)
    .collection("translations")
    .doc(locale)
    .get();
  const document = readFirestoreDocument(translationDocumentSchema, snapshot);
  return document?.status === "approved"
    ? toTranslation(locale, document)
    : null;
}
