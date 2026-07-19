import "server-only";

import { articleContentChangesSchema } from "@/features/articles/model/article-content-change";
import { articleContentApplyPrompt } from "@/features/articles/prompts/article-content-apply-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

export async function applyArticleContentChanges(
  projectId: string,
  articleId: string,
  currentContent: string,
  changesInput: unknown,
) {
  await getArticleGenerationContext(projectId, articleId);

  const content = currentContent.trim();
  const validation = validateArticleMdx(content);

  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);

  const changes = articleContentChangesSchema.min(1).parse(changesInput);

  const result = await generateArticleAi(
    articleContentApplyPrompt.system,
    JSON.stringify({ content, approvedChanges: changes }),
    { searchGrounding: false },
  );
  const resultValidation = validateArticleMdx(result.output);

  if (!resultValidation.valid)
    throw new ArticleServiceError(
      "provider",
      `AI returned invalid MDX: ${resultValidation.errors[0]}`,
    );

  return result;
}
