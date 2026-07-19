import { describe, expect, it } from "vitest";

import { getArticleHeadings } from "@/public-site/components/mdx/article-mdx-outline";

describe("getArticleHeadings", () => {
  it("returns stable links for level-two headings only", () => {
    expect(
      getArticleHeadings(`
## Begin with the *stores*

### App Store

## Begin with the stores

## What's next?
`),
    ).toEqual([
      { id: "begin-with-the-stores", label: "Begin with the stores" },
      { id: "begin-with-the-stores-1", label: "Begin with the stores" },
      { id: "whats-next", label: "What's next?" },
    ]);
  });

  it("supports localized heading text", () => {
    expect(getArticleHeadings("## Quản lý đăng ký")).toEqual([
      { id: "quản-lý-đăng-ký", label: "Quản lý đăng ký" },
    ]);
  });
});
