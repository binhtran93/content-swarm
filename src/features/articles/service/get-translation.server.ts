import "server-only";

import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { Translation } from "@/features/articles/model/translation";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticle } from "@/features/articles/service/get-article.server";
import { toTranslation } from "@/features/articles/service/to-translation.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getTranslation(
  projectId: string,
  articleId: string,
  locale: string,
): Promise<Translation> {
  await getArticle(projectId, articleId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId)
    .collection("translations")
    .doc(locale)
    .get();
  const document = readFirestoreDocument(translationDocumentSchema, snapshot);
  if (!document)
    throw new ArticleServiceError("unavailable", "Translation is unavailable.");
  return toTranslation(locale, document);
}
