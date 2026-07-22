import "server-only";

import type { MetadataRoute } from "next";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import { listPublicArticles } from "@/features/articles/public/list-public-articles.server";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { urgeZeroStaticLocales } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export async function buildUrgeZeroSitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles(
    urgeZeroSiteConfig.id,
    urgeZeroSiteConfig.defaultLocale,
  );
  const translated = await Promise.all(
    articles.flatMap((article) =>
      urgeZeroSiteConfig.locales
        .filter((locale) => locale !== urgeZeroSiteConfig.defaultLocale)
        .map(async (locale) => ({
          article,
          locale,
          translation: await getPublicTranslation(
            urgeZeroSiteConfig.id,
            article.articleId,
            locale,
          ),
        })),
    ),
  );
  const localizedBlogLocales = new Set(
    translated.filter((item) => item.translation).map((item) => item.locale),
  );
  const staticPaths = ["/", "/blog", "/support", "/privacy", "/terms"];
  return [
    ...staticPaths.map((path) => ({
      url: getCanonicalUrl(
        urgeZeroSiteConfig,
        urgeZeroSiteConfig.defaultLocale,
        path,
      ),
      changeFrequency:
        path === "/blog" ? ("daily" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/blog" ? 0.9 : 0.4,
    })),
    ...urgeZeroStaticLocales
      .filter((locale) => locale !== urgeZeroSiteConfig.defaultLocale)
      .flatMap((locale) =>
        ["/", "/support"].map((path) => ({
          url: getCanonicalUrl(urgeZeroSiteConfig, locale, path),
          changeFrequency: "monthly" as const,
          priority: path === "/" ? 0.9 : 0.4,
        })),
      ),
    ...[...localizedBlogLocales].map((locale) => ({
      url: getCanonicalUrl(urgeZeroSiteConfig, locale, "/blog"),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...articles.flatMap((article) =>
      article.slug
        ? [
            {
              url: getCanonicalUrl(
                urgeZeroSiteConfig,
                urgeZeroSiteConfig.defaultLocale,
                `/blog/${article.slug}`,
              ),
              lastModified: article.updatedAt,
              changeFrequency: "weekly" as const,
              priority: 0.8,
            },
          ]
        : [],
    ),
    ...translated.flatMap(({ locale, translation }) =>
      translation
        ? [
            {
              url: getCanonicalUrl(
                urgeZeroSiteConfig,
                locale,
                `/blog/${translation.slug}`,
              ),
              lastModified: translation.updatedAt,
              changeFrequency: "weekly" as const,
              priority: 0.7,
            },
          ]
        : [],
    ),
  ];
}
