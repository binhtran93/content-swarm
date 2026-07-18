import "server-only";

import { normalizeKeyword } from "@/features/keywords/model/keyword-input";
import {
  addKeywords,
  type AddKeywordsResult,
} from "@/features/keywords/service/add-keywords.server";
import { getDiscovery } from "@/features/keywords/service/get-discovery.server";

export async function addResultsToBacklog(
  projectId: string,
  discoveryId: string,
  keywords: string[],
): Promise<AddKeywordsResult> {
  const discovery = await getDiscovery(projectId, discoveryId);
  const selected = new Set(keywords.map(normalizeKeyword));
  return addKeywords(
    projectId,
    discovery.results
      .filter((result) => selected.has(normalizeKeyword(result.keyword)))
      .map((result) => ({
        keyword: result.keyword,
        countryCode: discovery.countryCode,
        languageCode: discovery.languageCode,
        searchVolume: result.searchVolume,
        difficulty: result.difficulty,
        sourceDiscoveryId: discovery.discoveryId,
      })),
  );
}
