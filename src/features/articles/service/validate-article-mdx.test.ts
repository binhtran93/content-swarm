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

  it("accepts static Tabs with titled Tab children", () => {
    expect(
      validateArticleMdx(`<Tabs>
  <Tab title="Platinum">
    **Platinum** is naturally white.
  </Tab>
  <Tab title="White gold">
    White gold is rhodium plated.
  </Tab>
</Tabs>`),
    ).toEqual({ valid: true, errors: [] });
  });

  it.each([
    [
      '<Tabs items={["One", "Two"]}><Tab title="One">1</Tab><Tab title="Two">2</Tab></Tabs>',
      "JavaScript expressions",
    ],
    ['<Tab title="One">Orphan</Tab>', "direct children"],
    [
      '<Tabs>\n<Tab>\nMissing\n</Tab>\n<Tab title="Two">\n2\n</Tab>\n</Tabs>',
      "non-empty string title",
    ],
    [
      '<Tabs>\n<Tab title="Same">\n1\n</Tab>\n<Tab title="same">\n2\n</Tab>\n</Tabs>',
      "unique",
    ],
    [
      '<Tabs className="wide">\n<Tab title="One">\n1\n</Tab>\n<Tab title="Two">\n2\n</Tab>\n</Tabs>',
      "does not accept attributes",
    ],
    ['<Tabs>\n<Tab title="Only">\n1\n</Tab>\n</Tabs>', "at least two"],
    [
      '<Tabs><Tabs.Tab>1</Tabs.Tab><Tab title="Two">2</Tab></Tabs>',
      "only direct Tab",
    ],
  ])("rejects an invalid static tabs contract: %s", (content, error) => {
    const result = validateArticleMdx(content);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.join(" ")).toContain(error);
  });
});
