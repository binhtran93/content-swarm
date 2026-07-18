import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import type { Keyword } from "@/features/keywords/model/keyword";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";
import { toKeyword } from "@/features/keywords/service/to-keyword.server";

export type KeywordFilters = {
  search?: string;
  countryCode?: string;
  languageCode?: string;
  assignment?: "available" | "assigned";
};

export async function listKeywords(
  projectId: string,
  filters: KeywordFilters = {},
): Promise<Keyword[]> {
  await requireOwner();
  await getProjectContext(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywords")
    .orderBy("normalizedKeyword", "asc")
    .get();
  const search = filters.search?.trim().toLocaleLowerCase();

  return snapshot.docs.flatMap((item) => {
    const document = readFirestoreDocument(keywordDocumentSchema, item);
    if (!document) return [];
    if (search && !document.normalizedKeyword.includes(search)) return [];
    if (filters.countryCode && document.countryCode !== filters.countryCode)
      return [];
    if (filters.languageCode && document.languageCode !== filters.languageCode)
      return [];
    if (filters.assignment === "available" && document.articleId) return [];
    if (filters.assignment === "assigned" && !document.articleId) return [];
    return [toKeyword(item.id, document)];
  });
}
