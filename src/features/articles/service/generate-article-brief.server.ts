import "server-only";

import { articleWritingRules } from "@/features/articles/config/writing-rules";
import { articleBriefPrompt } from "@/features/articles/prompts/article-brief-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";

export async function generateArticleBrief(
  projectId: string,
  articleId: string,
): Promise<string> {
  const context = await getArticleGenerationContext(projectId, articleId);
  return generateArticleAi(
    articleBriefPrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      locale: context.article.locale,
      primaryKeyword: context.primaryKeyword,
      supportingKeywords: context.supportingKeywords,
      writingRules: articleWritingRules,
    }),
  );
}
