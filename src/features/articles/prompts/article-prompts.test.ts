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
    expect(articleContentPrompt.version).toBe("article-content-v5");
    expect(articleContentPrompt.system).toContain(
      "complete primary keyword phrase",
    );
    expect(articleContentPrompt.system).toContain(
      "more useful than the plain keyword",
    );
    expect(articleContentPrompt.system).toContain(
      "skilled native editor from the requested market",
    );
    expect(articleContentPrompt.system).toContain("nobody speaks that way");
    expect(articleContentPrompt.system).toContain("Do not include an H1");
    expect(articleContentPrompt.system).toContain("do not invent facts");
    expect(articleContentPrompt.system).toContain("Do not use em dashes");
    expect(articleContentPrompt.system).toContain("not like a contract");
    expect(articleContentPrompt.system).toContain("componentAuthoringGuide");
    expect(articleExcerptPrompt.version).toBe("article-excerpt-v1");
    expect(articleExcerptPrompt.system).toContain("current article MDX");
    expect(articleExcerptPrompt.system).toContain("Do not use markdown");
    expect(articleContentReviewPrompt.version).toBe(
      "article-content-review-v2",
    );
    expect(articleContentReviewPrompt.system).toContain(
      "clear excerpt that lets the user recognize",
    );
    expect(articleContentApplyPrompt.version).toBe("article-content-apply-v2");
    expect(articleContentApplyPrompt.system).toContain(
      "Preserve every unselected passage",
    );
    expect(articleContentApplyPrompt.system).toContain(
      "componentAuthoringGuide",
    );
  });

  it("requires native localization while preserving MDX and facts", () => {
    expect(articleTranslationPrompt.version).toBe("article-translation-v2");
    expect(articleTranslationPrompt.system).toContain(
      "not translated word for word",
    );
    expect(articleTranslationPrompt.system).toContain("Preserve product names");
    expect(articleTranslationPrompt.system).toContain(
      "Do not add, remove, merge, or invent facts",
    );
    expect(articleTranslationPrompt.system).toContain(
      "componentAuthoringGuide",
    );
  });
});
