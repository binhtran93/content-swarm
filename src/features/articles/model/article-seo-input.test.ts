import { describe, expect, it } from "vitest";

import { articleSeoInputSchema } from "@/features/articles/model/article-seo-input";

describe("articleSeoInputSchema", () => {
  it("allows an article without taxonomy topics", () => {
    expect(
      articleSeoInputSchema.parse({
        slug: "keyword-title",
        topics: [],
        seoTitle: "Keyword title",
        seoDescription: "Generated excerpt.",
      }).topics,
    ).toEqual([]);
  });
});
