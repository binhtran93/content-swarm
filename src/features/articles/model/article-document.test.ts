import { Timestamp } from "firebase-admin/firestore";
import { describe, expect, it } from "vitest";

import { articleDocumentSchema } from "@/features/articles/model/article-document";

function document(overrides: Record<string, unknown> = {}) {
  const now = Timestamp.now();

  return {
    schemaVersion: 1,
    locale: "en-US",
    keywordId: "keyword-1",
    title: "Article title",
    slug: null,
    topic: null,
    excerpt: null,
    content: null,
    seoTitle: null,
    seoDescription: null,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("articleDocumentSchema", () => {
  it("reads a legacy topic as the first article topic", () => {
    const article = articleDocumentSchema.parse(
      document({ topic: "Memberships" }),
    );

    expect(article.topics).toEqual(["Memberships"]);
    expect(article).not.toHaveProperty("topic");
  });

  it("reads legacy brief and outline data as one article plan", () => {
    const article = articleDocumentSchema.parse(
      document({
        brief: "## Direction\n\nHelp the reader.",
        outline: "## Structure\n\n- First section",
      }),
    );

    expect(article.plan).toBe(
      "## Direction\n\nHelp the reader.\n\n---\n\n## Structure\n\n- First section",
    );
    expect(article).not.toHaveProperty("brief");
    expect(article).not.toHaveProperty("outline");
    expect(article.planReferences).toEqual([]);
    expect(article.contentReferences).toEqual([]);
  });

  it("prefers the stored article plan over legacy fields", () => {
    const article = articleDocumentSchema.parse(
      document({
        plan: "## Current plan",
        brief: "Legacy brief",
        outline: "Legacy outline",
      }),
    );

    expect(article.plan).toBe("## Current plan");
  });
});
