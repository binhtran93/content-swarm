import { describe, expect, it } from "vitest";

import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

describe("validateArticleMdx", () => {
  it("accepts body-only Markdown and approved semantic components", () => {
    expect(
      validateArticleMdx(
        '## Start here\n\n<Callout type="info">Useful note.</Callout>',
      ),
    ).toEqual({ valid: true, errors: [] });
  });

  it.each([
    ["# Duplicate title", "H1"],
    ["import Secret from './secret'", "imports"],
    ["## Hello {process.env.SECRET}", "expressions"],
    ["<script>alert('x')</script>", "Raw HTML"],
    ["<Unknown>text</Unknown>", "Unknown MDX component"],
  ])("rejects unsafe MDX: %s", (content, error) => {
    const result = validateArticleMdx(content);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.join(" ")).toContain(error);
  });

  it("allows code examples without treating their syntax as executable MDX", () => {
    expect(
      validateArticleMdx(
        "## Example\n\n```tsx\nconst value = { safe: true }\n```",
      ),
    ).toEqual({ valid: true, errors: [] });
  });
});
