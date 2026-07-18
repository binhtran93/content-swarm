import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listArticles(projectId: string): Promise<Article[]> {
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .orderBy("updatedAt", "desc")
    .get();
  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(articleDocumentSchema, item);
    return document ? [toArticle(item.id, document)] : [];
  });
}
