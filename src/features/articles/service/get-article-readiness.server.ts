import "server-only";

import { getArticle } from "@/features/articles/service/get-article.server";
import {
  evaluateArticleReadiness,
  type ArticleReadiness,
} from "@/features/articles/service/evaluate-article-readiness";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getArticleReadiness(
  projectId: string,
  articleId: string,
): Promise<ArticleReadiness> {
  const article = await getArticle(projectId, articleId);
  const keyword = readFirestoreDocument(
    keywordDocumentSchema,
    await getServerFirestore()
      .collection("projects")
      .doc(projectId)
      .collection("keywords")
      .doc(article.keywordId)
      .get(),
  );
  return evaluateArticleReadiness(article, {
    keywordAssigned: keyword?.articleId === articleId,
  });
}
