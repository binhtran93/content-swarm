import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import { toArticle } from "@/features/articles/service/to-article.server";
import { toTranslation } from "@/features/articles/service/to-translation.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getPublicLocalizedArticleBySlug(
  projectId: string,
  locale: string,
  slug: string,
) {
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
  const articleDocument = readFirestoreDocument(
    articleDocumentSchema,
    articleSnapshot,
  );
  const translationDocument = readFirestoreDocument(
    translationDocumentSchema,
    translationSnapshot,
  );
  if (
    !articleDocument ||
    articleDocument.status !== "published" ||
    !translationDocument ||
    translationDocument.status !== "approved" ||
    translationDocument.slug !== slug
  ) {
    return null;
  }
  return {
    source: toArticle(articleSnapshot.id, articleDocument),
    translation: toTranslation(locale, translationDocument),
  };
}
