import { describe, expect, it } from "vitest";

import type { Article } from "@/features/articles/model/article";
import { evaluateArticleReadiness } from "@/features/articles/service/evaluate-article-readiness";

const article: Article = {
  articleId: "article-1",
  locale: "en-US",
  keywordId: "keyword-1",
  title: "A useful title",
  slug: "a-useful-title",
  topic: "Useful topic",
  excerpt: "A useful summary.",
  brief: "Brief",
  outline: "## Outline",
  content: "## Useful section\n\nUseful body.",
  seoTitle: "Useful title",
  seoDescription: "A useful description.",
  status: "draft",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("evaluateArticleReadiness", () => {
  it("derives ready without storing another workflow status", () => {
    expect(
      evaluateArticleReadiness(article, {
        canonicalBaseUrl: "https://example.com",
        keywordAssigned: true,
      }),
    ).toEqual({ ready: true, blockers: [] });
  });

  it("reports deterministic saved-data blockers", () => {
    const result = evaluateArticleReadiness(
      { ...article, content: "# Unsafe H1", slug: "Bad Slug" },
      { canonicalBaseUrl: null, keywordAssigned: false },
    );
    expect(result.ready).toBe(false);
    expect(result.blockers).toContain("Project needs a canonical base URL.");
    expect(result.blockers).toContain(
      "The primary keyword is no longer assigned to this article.",
    );
    expect(result.blockers).toContain("Slug is invalid.");
    expect(result.blockers).toContain("Article content cannot contain an H1.");
  });
});
