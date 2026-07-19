import "server-only";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import type { Article } from "@/features/articles/model/article";
import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";

export async function loadArticleAlternates(
  config: PublicBlogConfig,
  source: Article,
) {
  if (!source.slug) return {};
  const values: Partial<Record<SupportedLocaleCode, string>> = {
    [config.defaultLocale]: getCanonicalUrl(
      config,
      config.defaultLocale,
      `/blog/${source.slug}`,
    ),
  };
  const translations = await Promise.all(
    config.locales
      .filter((locale) => locale !== config.defaultLocale)
      .map(async (locale) => ({
        locale,
        translation: await getPublicTranslation(
          config.id,
          source.articleId,
          locale,
        ),
      })),
  );
  for (const { locale, translation } of translations) {
    if (translation) {
      values[locale] = getCanonicalUrl(
        config,
        locale,
        `/blog/${translation.slug}`,
      );
    }
  }
  return values;
}
