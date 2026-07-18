import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import type { z } from "zod";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function updateArticle(
  projectId: string,
  articleId: string,
  update: (
    article: z.infer<typeof articleDocumentSchema>,
  ) => Record<string, unknown>,
): Promise<void> {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const reference = firestore
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .doc(articleId);
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const article = readFirestoreDocument(
      articleDocumentSchema,
      await transaction.get(reference),
    );
    if (!article)
      throw new ArticleServiceError("unavailable", "Article is unavailable.");
    if (article.status === "archived")
      throw new ArticleServiceError(
        "archived",
        "Archived articles cannot be edited.",
      );
    transaction.update(reference, {
      ...update(article),
      updatedAt: Timestamp.now(),
    });
  });
}
