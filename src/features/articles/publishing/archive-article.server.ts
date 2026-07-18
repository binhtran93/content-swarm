import "server-only";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";

export async function archiveArticle(
  projectId: string,
  articleId: string,
): Promise<void> {
  await updateArticle(projectId, articleId, (article) => {
    if (article.status !== "published")
      throw new ArticleServiceError(
        "invalid",
        "Only a published article can be archived.",
      );
    return { status: "archived" };
  });
}
