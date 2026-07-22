import "server-only";

import type { MetadataRoute } from "next";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import { listPublicArticles } from "@/features/articles/public/list-public-articles.server";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { jlensStaticLocales } from "@/public-site/sites/jlens/i18n/get-jlens-translator";

export async function buildJlensSitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles(
    jlensSiteConfig.id,
    jlensSiteConfig.defaultLocale,
  );
  const translated = await Promise.all(
    articles.flatMap((article) =>
      jlensSiteConfig.locales
        .filter((locale) => locale !== jlensSiteConfig.defaultLocale)
        .map(async (locale) => ({
          article,
          locale,
          translation: await getPublicTranslation(
            jlensSiteConfig.id,
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
        jlensSiteConfig,
        jlensSiteConfig.defaultLocale,
        path,
      ),
      changeFrequency:
        path === "/blog" ? ("daily" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/blog" ? 0.9 : 0.4,
    })),
    ...jlensStaticLocales
      .filter((locale) => locale !== jlensSiteConfig.defaultLocale)
      .flatMap((locale) =>
        ["/", "/support"].map((path) => ({
          url: getCanonicalUrl(jlensSiteConfig, locale, path),
          changeFrequency: "monthly" as const,
          priority: path === "/" ? 0.9 : 0.4,
        })),
      ),
    ...[...localizedBlogLocales].map((locale) => ({
      url: getCanonicalUrl(jlensSiteConfig, locale, "/blog"),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...articles.flatMap((article) =>
      article.slug
        ? [
            {
              url: getCanonicalUrl(
                jlensSiteConfig,
                jlensSiteConfig.defaultLocale,
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
                jlensSiteConfig,
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
