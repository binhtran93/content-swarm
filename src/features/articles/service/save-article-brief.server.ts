import "server-only";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";

export async function saveArticleBrief(
  projectId: string,
  articleId: string,
  brief: string,
): Promise<void> {
  const value = brief.trim();
  if (!value || value.length > 20_000)
    throw new ArticleServiceError(
      "invalid",
      "Enter a concise brief before saving.",
    );
  await updateArticle(projectId, articleId, () => ({ brief: value }));
}
