import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getArticle(
  projectId: string,
  articleId: string,
): Promise<Article> {
  await requireOwner();
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId)
    .get();
  const document = readFirestoreDocument(articleDocumentSchema, snapshot);
  if (!document)
    throw new ArticleServiceError("unavailable", "Article is unavailable.");
  return toArticle(snapshot.id, document);
}
