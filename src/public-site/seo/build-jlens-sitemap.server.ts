import "server-only";

import type { MetadataRoute } from "next";

import { listPublicArticles } from "@/features/articles/public/list-public-articles.server";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export async function buildJlensSitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles(
    jlensSiteConfig.id,
    jlensSiteConfig.defaultLocale,
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
  ];
}
