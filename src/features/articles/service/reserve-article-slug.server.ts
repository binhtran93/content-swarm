import "server-only";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticle } from "@/features/articles/service/get-article.server";
import { saveArticleSeo } from "@/features/articles/service/save-article-seo.server";

export async function reserveArticleSlug(
  projectId: string,
  articleId: string,
  sourceLocale: string,
  slug: string,
): Promise<void> {
  const article = await getArticle(projectId, articleId);
  if (article.locale !== sourceLocale)
    throw new ArticleServiceError(
      "invalid",
      "Source locale does not match the article.",
    );
  await saveArticleSeo(projectId, articleId, {
    slug,
    topics: article.topics,
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
  });
}
