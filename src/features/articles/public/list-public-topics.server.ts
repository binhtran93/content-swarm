import "server-only";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const MAX_TOPIC_SCAN_ARTICLES = 250;

export async function listPublicTopics(
  projectId: string,
  sourceLocale: string,
): Promise<string[]> {
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("articles")
    .where("status", "==", "published")
    .where("locale", "==", sourceLocale)
    .orderBy("updatedAt", "desc")
    .limit(MAX_TOPIC_SCAN_ARTICLES)
    .get();

  const topics = snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(articleDocumentSchema, item);
    return document?.topics ?? [];
  });
  return [...new Set(topics)].sort((left, right) => left.localeCompare(right));
}
