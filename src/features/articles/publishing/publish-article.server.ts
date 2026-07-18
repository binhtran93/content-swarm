import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { translationDocumentSchema } from "@/features/articles/model/translation-document";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { evaluateArticleReadiness } from "@/features/articles/service/evaluate-article-readiness";
import { toArticle } from "@/features/articles/service/to-article.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function publishArticle(
  projectId: string,
  articleId: string,
): Promise<void> {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const articleReference = projectReference
    .collection("articles")
    .doc(articleId);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const articleSnapshot = await transaction.get(articleReference);
    const articleDocument = readFirestoreDocument(
      articleDocumentSchema,
      articleSnapshot,
    );
    if (!articleDocument)
      throw new ArticleServiceError("unavailable", "Article is unavailable.");
    if (articleDocument.status !== "draft")
      throw new ArticleServiceError(
        "invalid",
        "Only a draft article can be published.",
      );
    const [projectSnapshot, keywordSnapshot, translationsSnapshot] =
      await Promise.all([
        transaction.get(projectReference),
        transaction.get(
          projectReference
            .collection("keywords")
            .doc(articleDocument.keywordId),
        ),
        transaction.get(articleReference.collection("translations")),
      ]);
    const project = readFirestoreDocument(
      projectDocumentSchema,
      projectSnapshot,
    );
    const keyword = readFirestoreDocument(
      keywordDocumentSchema,
      keywordSnapshot,
    );
    if (!project)
      throw new ArticleServiceError("unavailable", "Project is unavailable.");
    const readiness = evaluateArticleReadiness(
      toArticle(articleId, articleDocument),
      {
        canonicalBaseUrl: project.canonicalBaseUrl,
        keywordAssigned: keyword?.articleId === articleId,
      },
    );
    if (!readiness.ready)
      throw new ArticleServiceError("invalid", readiness.blockers[0]!);
    const sourceReservation = await transaction.get(
      projectReference
        .collection("articleSlugs")
        .doc(`${articleDocument.locale}--${articleDocument.slug}`),
    );
    if (sourceReservation.data()?.articleId !== articleId)
      throw new ArticleServiceError(
        "invalid",
        "Source slug is not reserved for this article.",
      );
    for (const snapshot of translationsSnapshot.docs) {
      const translation = readFirestoreDocument(
        translationDocumentSchema,
        snapshot,
      );
      if (!translation)
        throw new ArticleServiceError(
          "invalid",
          "A translation document is invalid.",
        );
      if (translation.status === "approved") {
        const validation = validateArticleMdx(translation.content);
        if (!validation.valid)
          throw new ArticleServiceError(
            "invalid",
            `${snapshot.id}: ${validation.errors[0]}`,
          );
        const reservation = await transaction.get(
          projectReference
            .collection("articleSlugs")
            .doc(`${snapshot.id}--${translation.slug}`),
        );
        if (reservation.data()?.articleId !== articleId)
          throw new ArticleServiceError(
            "invalid",
            `${snapshot.id}: slug is not reserved.`,
          );
      }
    }
    transaction.update(articleReference, {
      status: "published",
      updatedAt: Timestamp.now(),
    });
  });
}
