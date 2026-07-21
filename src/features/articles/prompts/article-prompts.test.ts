import { describe, expect, it } from "vitest";

import { articleContentApplyPrompt } from "@/features/articles/prompts/article-content-apply-prompt";
import { articleContentPrompt } from "@/features/articles/prompts/article-content-prompt";
import { articleContentReviewPrompt } from "@/features/articles/prompts/article-content-review-prompt";
import { articleExcerptPrompt } from "@/features/articles/prompts/article-excerpt-prompt";
import { articlePlanPrompt } from "@/features/articles/prompts/article-plan-prompt";
import { articleTranslationPrompt } from "@/features/articles/prompts/article-translation-prompt";

describe("article prompt contracts", () => {
  it("keeps versioned proposals editorial and body-only", () => {
    expect(articlePlanPrompt.version).toBe("article-plan-v3");
    expect(articlePlanPrompt.system).toContain("Do not write article prose");
    expect(articlePlanPrompt.system).toContain("Use Google Search");
    expect(articlePlanPrompt.system).toContain(
      "If a FAQ would genuinely help the reader",
    );
    expect(articlePlanPrompt.system).toContain("as the final H2 section");
    expect(articlePlanPrompt.system).toContain("Omit the FAQ when");
    expect(articleContentPrompt.version).toBe("article-content-v3");
    expect(articleContentPrompt.system).toContain("Do not include an H1");
    expect(articleContentPrompt.system).toContain("do not invent facts");
    expect(articleContentPrompt.system).toContain("Do not use em dashes");
    expect(articleContentPrompt.system).toContain("not like a contract");
    expect(articleExcerptPrompt.version).toBe("article-excerpt-v1");
    expect(articleExcerptPrompt.system).toContain("current article MDX");
    expect(articleExcerptPrompt.system).toContain("Do not use markdown");
    expect(articleContentReviewPrompt.version).toBe(
      "article-content-review-v1",
    );
    expect(articleContentReviewPrompt.system).toContain(
      "clear excerpt that lets the user recognize",
    );
    expect(articleContentApplyPrompt.version).toBe("article-content-apply-v1");
    expect(articleContentApplyPrompt.system).toContain(
      "Preserve every unselected passage",
    );
  });

  it("requires native localization while preserving MDX and facts", () => {
    expect(articleTranslationPrompt.version).toBe("article-translation-v1");
    expect(articleTranslationPrompt.system).toContain(
      "not translated word for word",
    );
    expect(articleTranslationPrompt.system).toContain("Preserve product names");
    expect(articleTranslationPrompt.system).toContain(
      "Do not add, remove, merge, or invent facts",
    );
  });
});
