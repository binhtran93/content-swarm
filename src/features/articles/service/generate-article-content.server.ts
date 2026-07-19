import "server-only";

import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { articleContentPrompt } from "@/features/articles/prompts/article-content-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import type { AiGeneration } from "@/platform/ai/generate-ai.server";

export async function generateArticleContent(
  projectId: string,
  articleId: string,
): Promise<AiGeneration<string>> {
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
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      title: article.title,
      plan: article.plan,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
    }),
  );
  const validation = validateArticleMdx(result.output);
  if (!validation.valid)
    throw new ArticleServiceError(
      "provider",
      `AI returned invalid MDX: ${validation.errors[0]}`,
    );
  return result;
}
