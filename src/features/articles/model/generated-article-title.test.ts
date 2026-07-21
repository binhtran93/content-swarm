import { describe, expect, it } from "vitest";

import { isUsefulGeneratedArticleTitle } from "@/features/articles/model/generated-article-title";

describe("isUsefulGeneratedArticleTitle", () => {
  it("accepts a clear title containing the complete keyword phrase", () => {
    expect(
      isUsefulGeneratedArticleTitle(
        "Sterling Silver Bracelets: How to Choose Quality Jewelry",
        "sterling silver bracelets",
      ),
    ).toBe(true);
  });

  it("rejects a plain keyword and partial phrase", () => {
    expect(
      isUsefulGeneratedArticleTitle(
        "Sterling silver bracelets",
        "sterling silver bracelets",
      ),
    ).toBe(false);
    expect(
      isUsefulGeneratedArticleTitle(
        "How to choose silver bracelets",
        "sterling silver bracelets",
      ),
    ).toBe(false);
  });
});
