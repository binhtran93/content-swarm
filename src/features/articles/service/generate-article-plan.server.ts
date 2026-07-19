import "server-only";

import { z } from "zod";

import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { articlePlanPrompt } from "@/features/articles/prompts/article-plan-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";

const outputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  planMarkdown: z.string().trim().min(1).max(40_000),
});

export async function generateArticlePlan(
  projectId: string,
  articleId: string,
) {
  const context = await getArticleGenerationContext(projectId, articleId);

  return generateArticleAi(
    articlePlanPrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      locale: context.article.locale,
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
    }),
    {
      format: {
        name: "article_plan",
        schema: outputSchema,
      },
    },
  );
}
