import "server-only";

import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { Translation } from "@/features/articles/model/translation";
import { getArticle } from "@/features/articles/service/get-article.server";
import { toTranslation } from "@/features/articles/service/to-translation.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listTranslations(
  projectId: string,
  articleId: string,
): Promise<Translation[]> {
  await getArticle(projectId, articleId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId)
    .collection("translations")
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(translationDocumentSchema, item);
    return document ? [toTranslation(item.id, document)] : [];
  });
}
