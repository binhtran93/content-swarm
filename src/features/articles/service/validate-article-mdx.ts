import { compileSync } from "@mdx-js/mdx";

import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";

export type MdxValidationResult =
  { valid: true; errors: [] } | { valid: false; errors: string[] };

export function validateArticleMdx(content: string): MdxValidationResult {
  const errors: string[] = [];
  const value = content.trim();
  const scannable = value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  if (!value) errors.push("Content is required.");
  if (value.length > 500_000) errors.push("Content is too long.");
  if (/^\s*#\s+/m.test(scannable))
    errors.push("Article content cannot contain an H1.");
  if (/^\s*(?:import|export)\s/m.test(scannable))
    errors.push("MDX imports and exports are not allowed.");
  if (/[{}]/.test(scannable))
    errors.push("MDX JavaScript expressions are not allowed.");
  if (/<\/?[a-z][^>]*>/m.test(scannable))
    errors.push("Raw HTML is not allowed.");

  const approved = new Set(Object.keys(articleMdxComponentDescriptions));
  for (const match of scannable.matchAll(/<\/?([A-Z][A-Za-z0-9]*)\b/g)) {
    if (!approved.has(match[1]!))
      errors.push(`Unknown MDX component: ${match[1]}.`);
  }
  for (const name of approved) {
    const openings = [
      ...scannable.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>`, "g")),
    ].filter((match) => !match[0].endsWith("/>")).length;
    const closings = [...scannable.matchAll(new RegExp(`</${name}>`, "g"))]
      .length;
    if (openings !== closings)
      errors.push(`Unbalanced ${name} component tags.`);
  }
  if (errors.length === 0) {
    try {
      compileSync(value, { outputFormat: "function-body" });
    } catch {
      errors.push("Content is not valid MDX.");
    }
  }
  return errors.length
    ? { valid: false, errors: [...new Set(errors)] }
    : { valid: true, errors: [] };
}
