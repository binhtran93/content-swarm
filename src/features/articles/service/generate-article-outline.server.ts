import "server-only";

import { z } from "zod";
import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { articleOutlinePrompt } from "@/features/articles/prompts/article-outline-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";

const outputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  outlineMarkdown: z.string().trim().min(1).max(30_000),
});

export async function generateArticleOutline(
  projectId: string,
  articleId: string,
) {
  const context = await getArticleGenerationContext(projectId, articleId);
  if (!context.article.brief)
    throw new ArticleServiceError(
      "invalid",
      "Save the brief before generating an outline.",
    );
  return generateArticleAi(
    articleOutlinePrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      locale: context.article.locale,
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      brief: context.article.brief,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
    }),
    {
      name: "article_outline",
      schema: outputSchema,
    },
  );
}
