import "server-only";

import { z } from "zod";

import {
  articleMdxAuthoringGuide,
  articleMdxComponentDescriptions,
} from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { isUsefulGeneratedArticleTitle } from "@/features/articles/model/generated-article-title";
import { articleContentPrompt } from "@/features/articles/prompts/article-content-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

const outputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(500_000),
});

export async function generateArticleContent(
  projectId: string,
  articleId: string,
) {
  const context = await getArticleGenerationContext(projectId, articleId);
  const { article } = context;
  if (!article.title || !article.plan)
    throw new ArticleServiceError(
      "invalid",
      "Save the article title and plan before generating content.",
    );
  const result = await generateArticleAi(
    articleContentPrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      locale: article.locale,
      market: context.market,
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      workingTitle: article.title,
      plan: article.plan,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
      componentAuthoringGuide: articleMdxAuthoringGuide,
    }),
    { format: { name: "article_content", schema: outputSchema } },
  );
  if (
    !isUsefulGeneratedArticleTitle(result.output.title, context.primaryKeyword)
  )
    throw new ArticleServiceError(
      "provider",
      "AI returned a title without the complete primary keyword and a clear angle.",
    );
  const validation = validateArticleMdx(result.output.content);
  if (!validation.valid)
    throw new ArticleServiceError(
      "provider",
      `AI returned invalid MDX: ${validation.errors[0]}`,
    );
  return result;
}
