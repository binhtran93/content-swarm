import "server-only";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import { listPublicArticlePage } from "@/features/articles/public/list-public-article-page.server";
import { listPublicTopics } from "@/features/articles/public/list-public-topics.server";
import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";

export async function loadBlogPage(input: {
  config: PublicBlogConfig;
  locale: SupportedLocaleCode;
  topic?: string;
  cursor?: string;
}) {
  const [page, topics] = await Promise.all([
    listPublicArticlePage({
      projectId: input.config.id,
      sourceLocale: input.config.defaultLocale,
      topic: input.topic,
      cursor: input.cursor,
      pageSize: input.config.blog.postsPerPage,
    }),
    listPublicTopics(input.config.id, input.config.defaultLocale),
  ]);

  const items = await Promise.all(
    page.items.map(async (article) => {
      const translation =
        input.locale === input.config.defaultLocale
          ? null
          : await getPublicTranslation(
              input.config.id,
              article.articleId,
              input.locale,
            );
      return {
        id: article.articleId,
        title: translation?.title ?? article.title ?? "Untitled article",
        slug: translation?.slug ?? article.slug ?? article.articleId,
        excerpt: translation?.excerpt ?? article.excerpt,
        topics: article.topics,
        updatedAt: translation?.updatedAt ?? article.updatedAt,
        isSourceFallback:
          input.locale !== input.config.defaultLocale && !translation,
      };
    }),
  );

  return { ...page, items, topics };
}
