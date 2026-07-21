import { findSupportedMarket } from "@/config/supported-locales";
import type { Keyword, KeywordGroup } from "@/features/keywords/model/keyword";

function metric(value: number | null, missing: number) {
  return value === null ? missing : value;
}

export function selectAutomationKeyword(
  keywords: Keyword[],
  groups: KeywordGroup[],
): Keyword | null {
  const groupsById = new Map(groups.map((group) => [group.groupId, group]));
  const eligible = keywords.filter((keyword) => {
    if (keyword.articleId) return false;
    if (!findSupportedMarket(keyword.countryCode, keyword.languageCode))
      return false;
    if (!keyword.groupId) return true;
    const group = groupsById.get(keyword.groupId);
    return Boolean(
      group &&
      group.primaryKeywordId === keyword.keywordId &&
      group.memberKeywordIds.every(
        (id) => !keywords.find((item) => item.keywordId === id)?.articleId,
      ),
    );
  });

  return (
    eligible.sort(
      (left, right) =>
        metric(right.searchVolume, -1) - metric(left.searchVolume, -1) ||
        metric(left.difficulty, 101) - metric(right.difficulty, 101) ||
        left.createdAt.localeCompare(right.createdAt) ||
        left.keywordId.localeCompare(right.keywordId),
    )[0] ?? null
  );
}
