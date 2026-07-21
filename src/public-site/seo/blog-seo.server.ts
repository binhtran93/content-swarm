import "server-only";

import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { loadArticleAlternates } from "@/public-site/blog/load-article-alternates.server";
import { loadBlogArticle } from "@/public-site/blog/load-blog-article.server";

export async function createBlogArticleMetadata(
  config: PublicBlogConfig,
  locale: SupportedLocaleCode,
  slug: string,
): Promise<Metadata | null> {
  const result = await loadBlogArticle({ config, locale, slug });
  if (!result) return null;
  const title =
    result.translation?.seoTitle ??
    result.source.seoTitle ??
    result.translation?.title ??
    result.source.title ??
    `${config.brand.name} guide`;
  const description =
    result.translation?.seoDescription ??
    result.source.seoDescription ??
    result.translation?.excerpt ??
    result.source.excerpt ??
    config.blog.description;
  const canonical = result.isSourceFallback
    ? getCanonicalUrl(
        config,
        config.defaultLocale,
        `/blog/${result.source.slug}`,
      )
    : getCanonicalUrl(
        config,
        locale,
        `/blog/${result.translation?.slug ?? result.source.slug}`,
      );
  const languages = await loadArticleAlternates(config, result.source);
  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: result.isSourceFallback
      ? { index: false, follow: true }
      : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: config.brand.name,
      url: canonical,
      publishedTime: result.source.createdAt,
      modifiedTime: result.translation?.updatedAt ?? result.source.updatedAt,
    },
  };
}
