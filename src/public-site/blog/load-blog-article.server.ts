import "server-only";

import { getPublicArticleBySlug } from "@/features/articles/public/get-public-article-by-slug.server";
import { getPublicLocalizedArticleBySlug } from "@/features/articles/public/get-public-localized-article-by-slug.server";
import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";

export async function loadBlogArticle(input: {
  config: PublicBlogConfig;
  locale: SupportedLocaleCode;
  slug: string;
}) {
  if (input.locale === input.config.defaultLocale) {
    const source = await getPublicArticleBySlug(
      input.config.id,
      input.config.defaultLocale,
      input.slug,
    );
    if (!source) return null;
    return {
      source,
      translation: null,
      redirectSlug: null,
      isSourceFallback: false,
    };
  }

  const localized = await getPublicLocalizedArticleBySlug(
    input.config.id,
    input.locale,
    input.slug,
  );
  if (localized) {
    return {
      ...localized,
      redirectSlug: null,
      isSourceFallback: false,
    };
  }

  const source = await getPublicArticleBySlug(
    input.config.id,
    input.config.defaultLocale,
    input.slug,
  );
  if (!source) return null;
  const approved = await getPublicTranslation(
    input.config.id,
    source.articleId,
    input.locale,
  );
  return {
    source,
    translation: null,
    redirectSlug: approved?.slug ?? null,
    isSourceFallback: !approved,
  };
}
