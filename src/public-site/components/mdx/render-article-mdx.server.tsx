import "server-only";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { articleMdxComponents } from "@/public-site/components/mdx/article-mdx-components";
import { getArticleHeadings } from "@/public-site/components/mdx/article-mdx-outline";

export async function renderArticleMdx(source: string) {
  const validation = validateArticleMdx(source);
  if (!validation.valid)
    throw new Error("Article content is not safe to render.");

  const headings = getArticleHeadings(source);
  const { content } = await compileMDX({
    source,
    components: articleMdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  return { content, headings };
}
