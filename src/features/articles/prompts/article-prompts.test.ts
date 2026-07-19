import { describe, expect, it } from "vitest";

import { articleContentImprovePrompt } from "@/features/articles/prompts/article-content-improve-prompt";
import { articleContentPrompt } from "@/features/articles/prompts/article-content-prompt";
import { articlePlanPrompt } from "@/features/articles/prompts/article-plan-prompt";
import { articleTranslationPrompt } from "@/features/articles/prompts/article-translation-prompt";

describe("article prompt contracts", () => {
  it("keeps versioned proposals editorial and body-only", () => {
    expect(articlePlanPrompt.version).toBe("article-plan-v1");
    expect(articlePlanPrompt.system).toContain("Do not write article prose");
    expect(articlePlanPrompt.system).toContain("Use Google Search");
    expect(articleContentPrompt.version).toBe("article-content-v3");
    expect(articleContentPrompt.system).toContain("Do not include an H1");
    expect(articleContentPrompt.system).toContain("do not invent facts");
    expect(articleContentPrompt.system).toContain("Do not use em dashes");
    expect(articleContentPrompt.system).toContain("not like a contract");
    expect(articleContentImprovePrompt.version).toBe(
      "article-content-improve-v3",
    );
    expect(articleContentImprovePrompt.system).toContain(
      "Return the complete improved MDX",
    );
    expect(articleContentImprovePrompt.system).toContain(
      "Remove every em dash",
    );
    expect(articleContentImprovePrompt.system).toContain(
      "Rewrite legalistic, bureaucratic, and policy-like prose",
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
