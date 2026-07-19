import "server-only";

import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { articleContentImprovePrompt } from "@/features/articles/prompts/article-content-improve-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import type { AiGeneration } from "@/platform/ai/generate-ai.server";

export async function improveArticleContent(
  projectId: string,
  articleId: string,
): Promise<AiGeneration<string>> {
  const context = await getArticleGenerationContext(projectId, articleId);
  if (!context.article.content)
    throw new ArticleServiceError(
      "invalid",
      "Save content before asking AI to improve it.",
    );
  const proposal = await generateArticleAi(
    articleContentImprovePrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      locale: context.article.locale,
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      title: context.article.title,
      plan: context.article.plan,
      content: context.article.content,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
    }),
  );
  const validation = validateArticleMdx(proposal.output);
  if (!validation.valid)
    throw new ArticleServiceError(
      "provider",
      `AI returned invalid MDX: ${validation.errors[0]}`,
    );
  return proposal;
}
