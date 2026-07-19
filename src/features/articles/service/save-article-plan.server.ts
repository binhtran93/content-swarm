import "server-only";

import type { ArticleReference } from "@/features/articles/model/article-reference";
import { articleReferencesSchema } from "@/features/articles/model/article-reference";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";

export async function saveArticlePlan(
  projectId: string,
  articleId: string,
  plan: string,
  references: ArticleReference[],
): Promise<void> {
  const nextPlan = plan.trim();

  if (!nextPlan || nextPlan.length > 40_000)
    throw new ArticleServiceError(
      "invalid",
      "Enter an article plan before saving.",
    );

  const nextReferences = articleReferencesSchema.parse(references);

  await updateArticle(projectId, articleId, () => ({
    plan: nextPlan,
    planReferences: nextReferences,
  }));
}
