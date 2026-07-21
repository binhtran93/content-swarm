import { describe, expect, it } from "vitest";

import { articleTitleFromKeyword } from "@/features/articles/model/article-title";

describe("articleTitleFromKeyword", () => {
  it("uppercases the first character and preserves the remaining keyword", () => {
    expect(articleTitleFromKeyword("  how to cancel a subscription  ")).toBe(
      "How to cancel a subscription",
    );
  });
});
