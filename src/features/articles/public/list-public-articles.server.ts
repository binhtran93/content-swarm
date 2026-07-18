import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listPublicArticles(
  projectId: string,
  locale: string,
): Promise<Article[]> {
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .where("status", "==", "published")
    .where("locale", "==", locale)
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(articleDocumentSchema, item);
    return document ? [toArticle(item.id, document)] : [];
  });
}
