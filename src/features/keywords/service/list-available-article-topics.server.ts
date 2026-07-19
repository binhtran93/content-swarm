import "server-only";

import { findSupportedMarket } from "@/config/supported-locales";
import type { ArticleTopic } from "@/features/keywords/model/keyword";
import { listKeywordGroups } from "@/features/keywords/service/list-keyword-groups.server";
import { listKeywords } from "@/features/keywords/service/list-keywords.server";

export async function listAvailableArticleTopics(
  projectId: string,
): Promise<ArticleTopic[]> {
  const [keywords, groups] = await Promise.all([
    listKeywords(projectId, { assignment: "available" }),
    listKeywordGroups(projectId),
  ]);
  const supportedKeywords = keywords.filter((keyword) =>
    findSupportedMarket(keyword.countryCode, keyword.languageCode),
  );
  const byId = new Map(
    supportedKeywords.map((keyword) => [keyword.keywordId, keyword]),
  );
  const groupTopics = groups.flatMap((group): ArticleTopic[] => {
    const primary = byId.get(group.primaryKeywordId);
    const members = group.memberKeywordIds.map((id) => byId.get(id));
    if (!primary || members.some((member) => !member)) return [];
    const supporting = members
      .filter((member) => member!.keywordId !== primary.keywordId)
      .map((member) => member!)
      .sort((a, b) => a.normalizedKeyword.localeCompare(b.normalizedKeyword));
    return [
      { id: `group:${group.groupId}`, kind: "group", primary, supporting },
    ];
  });
  const individualTopics = supportedKeywords
    .filter((keyword) => !keyword.groupId)
    .map((primary): ArticleTopic => ({
      id: `keyword:${primary.keywordId}`,
      kind: "keyword",
      primary,
      supporting: [],
    }));
  return [...groupTopics, ...individualTopics].sort((a, b) =>
    a.primary.normalizedKeyword.localeCompare(b.primary.normalizedKeyword),
  );
}
