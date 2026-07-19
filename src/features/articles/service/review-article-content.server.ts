import "server-only";

import { z } from "zod";

import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleWritingRules } from "@/features/articles/config/writing-rules";
import {
  articleContentChangesSchema,
  assertApplicableContentChanges,
} from "@/features/articles/model/article-content-change";
import { articleContentReviewPrompt } from "@/features/articles/prompts/article-content-review-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

const outputSchema = z.object({
  changes: articleContentChangesSchema,
});

export async function reviewArticleContent(
  projectId: string,
  articleId: string,
  content: string,
) {
  const currentContent = content.trim();
  const validation = validateArticleMdx(currentContent);

  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);

  const context = await getArticleGenerationContext(projectId, articleId);
  const result = await generateArticleAi(
    articleContentReviewPrompt.system,
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
      currentContent,
      writingRules: articleWritingRules,
      approvedComponents: articleMdxComponentDescriptions,
    }),
    {
      format: {
        name: "article_content_review",
        schema: outputSchema,
      },
    },
  );

  try {
    assertApplicableContentChanges(currentContent, result.output.changes);
  } catch (error) {
    throw new ArticleServiceError(
      "provider",
      error instanceof Error
        ? error.message
        : "AI returned invalid content changes.",
    );
  }

  return result;
}
