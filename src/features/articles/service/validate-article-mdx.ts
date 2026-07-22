import { compileSync } from "@mdx-js/mdx";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

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
      validateTabs(value, errors);
    } catch {
      errors.push("Content is not valid MDX.");
    }
  }
  return errors.length
    ? { valid: false, errors: [...new Set(errors)] }
    : { valid: true, errors: [] };
}

function validateTabs(content: string, errors: string[]) {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(content);

  visit(tree, (candidate, _index, parent) => {
    if (
      candidate.type !== "mdxJsxFlowElement" &&
      candidate.type !== "mdxJsxTextElement"
    )
      return;
    const node = candidate as ArticleJsxElement;

    if (node.name === "Tab") {
      const tabParent = parent as ArticleJsxElement | undefined;
      if (tabParent?.name !== "Tabs")
        errors.push("Tab components must be direct children of Tabs.");
      validateTabAttributes(node, errors);
      return;
    }

    if (node.name !== "Tabs") return;
    if (node.attributes.length > 0)
      errors.push("Tabs does not accept attributes.");

    const tabs = node.children.filter(
      (child): child is ArticleJsxElement =>
        (child.type === "mdxJsxFlowElement" ||
          child.type === "mdxJsxTextElement") &&
        child.name === "Tab",
    );
    if (tabs.length !== node.children.length)
      errors.push("Tabs may contain only direct Tab components.");
    if (tabs.length < 2)
      errors.push("Tabs requires at least two Tab components.");

    const titles = tabs
      .map((tab) => tabTitle(tab))
      .filter((title): title is string => Boolean(title));
    if (
      new Set(titles.map((title) => title.toLocaleLowerCase())).size !==
      titles.length
    )
      errors.push("Tab titles must be unique within Tabs.");
  });
}

type ArticleJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

function validateTabAttributes(node: ArticleJsxElement, errors: string[]) {
  if (
    node.attributes.length !== 1 ||
    node.attributes[0]?.type !== "mdxJsxAttribute" ||
    node.attributes[0].name !== "title"
  )
    errors.push("Tab accepts only one title attribute.");

  if (!tabTitle(node)) errors.push("Tab requires a non-empty string title.");
}

function tabTitle(node: ArticleJsxElement): string | undefined {
  const attribute = node.attributes.find(
    (candidate) =>
      candidate.type === "mdxJsxAttribute" && candidate.name === "title",
  );
  return typeof attribute?.value === "string" && attribute.value.trim()
    ? attribute.value.trim()
    : undefined;
}
