import "server-only";

import { MDXRemote } from "next-mdx-remote/rsc";

import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { articleMdxComponents } from "@/public-site/components/mdx/article-mdx-components";

export async function RenderArticleMdx({ content }: { content: string }) {
  const validation = validateArticleMdx(content);
  if (!validation.valid)
    throw new Error("Article content is not safe to render.");
  return <MDXRemote source={content} components={articleMdxComponents} />;
}
