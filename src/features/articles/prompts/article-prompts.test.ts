import { describe, expect, it } from "vitest";

import { articleBriefPrompt } from "@/features/articles/prompts/article-brief-prompt";
import { articleContentImprovePrompt } from "@/features/articles/prompts/article-content-improve-prompt";
import { articleContentPrompt } from "@/features/articles/prompts/article-content-prompt";
import { articleOutlinePrompt } from "@/features/articles/prompts/article-outline-prompt";
import { articleTranslationPrompt } from "@/features/articles/prompts/article-translation-prompt";

describe("article prompt contracts", () => {
  it("keeps versioned proposals editorial and body-only", () => {
    expect(articleBriefPrompt.version).toBe("article-brief-v1");
    expect(articleBriefPrompt.system).toContain("Do not write article prose");
    expect(articleOutlinePrompt.version).toBe("article-outline-v1");
    expect(articleOutlinePrompt.system).toContain(
      "Do not write full article prose",
    );
    expect(articleContentPrompt.version).toBe("article-content-v1");
    expect(articleContentPrompt.system).toContain("Do not include an H1");
    expect(articleContentPrompt.system).toContain("do not invent facts");
    expect(articleContentImprovePrompt.version).toBe(
      "article-content-improve-v1",
    );
    expect(articleContentImprovePrompt.system).toContain(
      "Return the complete improved MDX",
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
