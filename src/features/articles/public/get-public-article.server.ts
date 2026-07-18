import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getPublicArticle(
  projectId: string,
  articleId: string,
): Promise<Article | null> {
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId)
    .get();
  const document = readFirestoreDocument(articleDocumentSchema, snapshot);
  return document?.status === "published"
    ? toArticle(snapshot.id, document)
    : null;
}
