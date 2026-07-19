import "server-only";

import { z } from "zod";

import { articleExcerptPrompt } from "@/features/articles/prompts/article-excerpt-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

const outputSchema = z.object({
  excerpt: z.string().trim().min(1).max(500),
});

export async function generateArticleExcerpt(
  projectId: string,
  articleId: string,
  content: string,
) {
  const value = content.trim();
  const validation = validateArticleMdx(value);

  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);

  const context = await getArticleGenerationContext(projectId, articleId);

  return generateArticleAi(
    articleExcerptPrompt.system,
    JSON.stringify({
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      content: value,
    }),
    {
      format: {
        name: "article_excerpt",
        schema: outputSchema,
      },
      searchGrounding: false,
    },
  );
}
