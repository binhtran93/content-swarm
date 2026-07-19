import "server-only";

import type { MetadataRoute } from "next";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import { listPublicArticles } from "@/features/articles/public/list-public-articles.server";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export async function buildSubiqSitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles(
    subiqSiteConfig.id,
    subiqSiteConfig.defaultLocale,
  );
  const translated = await Promise.all(
    articles.flatMap((article) =>
      subiqSiteConfig.locales
        .filter((locale) => locale !== subiqSiteConfig.defaultLocale)
        .map(async (locale) => ({
          article,
          locale,
          translation: await getPublicTranslation(
            subiqSiteConfig.id,
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
        subiqSiteConfig,
        subiqSiteConfig.defaultLocale,
        path,
      ),
      changeFrequency:
        path === "/blog" ? ("daily" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/blog" ? 0.9 : 0.4,
    })),
    ...[...localizedBlogLocales].map((locale) => ({
      url: getCanonicalUrl(subiqSiteConfig, locale, "/blog"),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...articles.flatMap((article) =>
      article.slug
        ? [
            {
              url: getCanonicalUrl(
                subiqSiteConfig,
                subiqSiteConfig.defaultLocale,
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
                subiqSiteConfig,
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
