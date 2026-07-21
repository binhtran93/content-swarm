import { describe, expect, it } from "vitest";

import { selectAutomationKeyword } from "@/features/articles/automation/article-automation-selection";
import type { Keyword, KeywordGroup } from "@/features/keywords/model/keyword";

function keyword(keywordId: string, values: Partial<Keyword> = {}): Keyword {
  return {
    keywordId,
    keyword: keywordId,
    normalizedKeyword: keywordId,
    countryCode: "US",
    languageCode: "en",
    searchVolume: 100,
    difficulty: 20,
    sourceDiscoveryId: null,
    relevanceOrder: null,
    groupId: null,
    articleId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...values,
  };
}

describe("selectAutomationKeyword", () => {
  it("prefers volume, then difficulty, then age", () => {
    const result = selectAutomationKeyword(
      [
        keyword("low-volume", { searchVolume: 50, difficulty: 1 }),
        keyword("hard", { searchVolume: 200, difficulty: 70 }),
        keyword("winner", { searchVolume: 200, difficulty: 10 }),
      ],
      [],
    );
    expect(result?.keywordId).toBe("winner");
  });

  it("excludes assigned and unsupported markets", () => {
    expect(
      selectAutomationKeyword(
        [
          keyword("assigned", { articleId: "article" }),
          keyword("unsupported", {
            countryCode: "US",
            languageCode: "vi",
          }),
          keyword("eligible"),
        ],
        [],
      )?.keywordId,
    ).toBe("eligible");
  });

  it("selects only a fully available group's primary keyword", () => {
    const group: KeywordGroup = {
      groupId: "group",
      name: null,
      primaryKeywordId: "primary",
      memberKeywordIds: ["primary", "supporting"],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    expect(
      selectAutomationKeyword(
        [
          keyword("primary", { groupId: "group" }),
          keyword("supporting", { groupId: "group", searchVolume: 999 }),
        ],
        [group],
      )?.keywordId,
    ).toBe("primary");
  });
});
