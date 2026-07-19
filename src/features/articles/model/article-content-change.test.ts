import { describe, expect, it } from "vitest";

import { articleContentChangeSchema } from "@/features/articles/model/article-content-change";

describe("article content changes", () => {
  it("rejects empty and identical replacements", () => {
    expect(() =>
      articleContentChangeSchema.parse({ before: "", after: "Better" }),
    ).toThrow();
    expect(() =>
      articleContentChangeSchema.parse({ before: "Same", after: "Same" }),
    ).toThrow("must be different");
  });
});
