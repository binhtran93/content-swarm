import "server-only";

import type { z } from "zod";

import type { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import type { Keyword } from "@/features/keywords/model/keyword";

export function toKeyword(
  keywordId: string,
  document: z.infer<typeof keywordDocumentSchema>,
): Keyword {
  return {
    keywordId,
    keyword: document.keyword,
    normalizedKeyword: document.normalizedKeyword,
    countryCode: document.countryCode,
    languageCode: document.languageCode,
    searchVolume: document.searchVolume,
    difficulty: document.difficulty,
    sourceDiscoveryId: document.sourceDiscoveryId,
    groupId: document.groupId,
    articleId: document.articleId,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
