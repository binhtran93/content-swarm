import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function deleteArticle(
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

    const [articleSnapshot, keywordSnapshots, slugSnapshots, translations] =
      await Promise.all([
        transaction.get(articleReference),
        transaction.get(
          projectReference
            .collection("keywords")
            .where("articleId", "==", articleId),
        ),
        transaction.get(
          projectReference
            .collection("articleSlugs")
            .where("articleId", "==", articleId),
        ),
        transaction.get(articleReference.collection("translations")),
      ]);

    const article = readFirestoreDocument(
      articleDocumentSchema,
      articleSnapshot,
    );
    if (!article)
      throw new ArticleServiceError("unavailable", "Article is unavailable.");

    const now = Timestamp.now();
    keywordSnapshots.docs.forEach((snapshot) =>
      transaction.update(snapshot.ref, { articleId: null, updatedAt: now }),
    );
    slugSnapshots.docs.forEach((snapshot) => transaction.delete(snapshot.ref));
    translations.docs.forEach((snapshot) => transaction.delete(snapshot.ref));
    transaction.delete(articleReference);
  });
}
