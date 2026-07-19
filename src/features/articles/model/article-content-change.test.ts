import { describe, expect, it } from "vitest";

import {
  articleContentChangeSchema,
  assertApplicableContentChanges,
} from "@/features/articles/model/article-content-change";

describe("article content changes", () => {
  it("rejects empty and identical replacements", () => {
    expect(() =>
      articleContentChangeSchema.parse({ before: "", after: "Better" }),
    ).toThrow();
    expect(() =>
      articleContentChangeSchema.parse({ before: "Same", after: "Same" }),
    ).toThrow("must be different");
  });

  it("accepts unique non-overlapping passages", () => {
    expect(() =>
      assertApplicableContentChanges("First paragraph.\n\nSecond paragraph.", [
        { before: "First paragraph.", after: "A better first paragraph." },
        { before: "Second paragraph.", after: "A better second paragraph." },
      ]),
    ).not.toThrow();
  });

  it("rejects missing, repeated, and overlapping passages", () => {
    expect(() =>
      assertApplicableContentChanges("Current content", [
        { before: "Missing", after: "Replacement" },
      ]),
    ).toThrow("no longer exists");
    expect(() =>
      assertApplicableContentChanges("Repeat. Repeat.", [
        { before: "Repeat.", after: "Replacement." },
      ]),
    ).toThrow("not unique");
    expect(() =>
      assertApplicableContentChanges("Overlapping passage", [
        { before: "Overlapping passage", after: "Replacement" },
        { before: "passage", after: "section" },
      ]),
    ).toThrow("overlap");
  });
});
