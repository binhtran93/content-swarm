import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getPublicArticleBySlug(
  projectId: string,
  locale: string,
  slug: string,
): Promise<Article | null> {
  const project = getServerFirestore().collection("projects").doc(projectId);
  const reservation = await project
    .collection("articleSlugs")
    .doc(`${locale}--${slug}`)
    .get();
  const articleId = reservation.data()?.articleId;
  if (typeof articleId !== "string") return null;
  const snapshot = await project.collection("articles").doc(articleId).get();
  const document = readFirestoreDocument(articleDocumentSchema, snapshot);
  if (
    !document ||
    document.status !== "published" ||
    document.locale !== locale ||
    document.slug !== slug
  )
    return null;
  return toArticle(snapshot.id, document);
}
