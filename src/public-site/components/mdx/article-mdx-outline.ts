import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type ArticleHeading = {
  id: string;
  label: string;
};

type HeadingNode = {
  type: "heading";
  depth: number;
};

export function getArticleHeadings(source: string): ArticleHeading[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];

  visit(tree, "heading", (node) => {
    const heading = node as HeadingNode;
    if (heading.depth !== 2) return;

    const label = toString(node).trim();
    if (!label) return;

    headings.push({ id: slugger.slug(label), label });
  });

  return headings;
}
