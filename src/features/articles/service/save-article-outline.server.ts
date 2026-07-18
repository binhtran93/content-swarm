import "server-only";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";

export async function saveArticleOutline(
  projectId: string,
  articleId: string,
  outline: string,
  title: string,
): Promise<void> {
  const nextOutline = outline.trim();
  const nextTitle = title.trim();
  if (
    !nextOutline ||
    nextOutline.length > 30_000 ||
    !nextTitle ||
    nextTitle.length > 200
  )
    throw new ArticleServiceError(
      "invalid",
      "Enter a title and outline before saving.",
    );
  await updateArticle(projectId, articleId, (article) => {
    if (!article.brief)
      throw new ArticleServiceError(
        "invalid",
        "Save the brief before the outline.",
      );
    return { outline: nextOutline, title: nextTitle };
  });
}
