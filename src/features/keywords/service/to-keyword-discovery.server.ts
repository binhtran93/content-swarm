import "server-only";

import type { z } from "zod";

import type { keywordDiscoveryDocumentSchema } from "@/features/keywords/model/keyword-discovery-document";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";

export function toKeywordDiscovery(
  discoveryId: string,
  document: z.infer<typeof keywordDiscoveryDocumentSchema>,
): KeywordDiscovery {
  return {
    discoveryId,
    requestKey: document.requestKey,
    method: document.method,
    input: document.input,
    countryCode: document.countryCode,
    languageCode: document.languageCode,
    limit: document.limit,
    minimumVolume: document.minimumVolume,
    maximumDifficulty: document.maximumDifficulty,
    orderBy: document.orderBy,
    results: document.results,
    createdAt: document.createdAt.toDate().toISOString(),
  };
}
