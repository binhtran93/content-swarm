import { notFound, redirect } from "next/navigation";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { loadArticleAlternates } from "@/public-site/blog/load-article-alternates.server";
import { loadBlogArticle } from "@/public-site/blog/load-blog-article.server";
import { BlogArticle } from "@/public-site/components/blog/blog-article";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import {
  getCanonicalUrl,
  getProjectRoutePrefix,
} from "@/public-site/config/public-url";
import {
  getLocalizedJlensBlogConfig,
  jlensBlogConfig,
} from "@/public-site/sites/jlens/blog-config";
import { getJlensTranslator } from "@/public-site/sites/jlens/i18n/get-jlens-translator";

import "./theme.css";

export async function JlensBlogArticlePage({
  locale,
  slug,
}: {
  locale: SupportedLocaleCode;
  slug: string;
}) {
  const config = getLocalizedJlensBlogConfig(locale);
  const t = getJlensTranslator(locale);
  const result = await loadBlogArticle({
    config: jlensBlogConfig,
    locale,
    slug,
  });
  if (!result) notFound();

  const routePrefix = getProjectRoutePrefix(config);
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  if (result.redirectSlug) {
    redirect(`${routePrefix}${localePrefix}/blog/${result.redirectSlug}`);
  }

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
  const canonicalAlternates = await loadArticleAlternates(
    jlensBlogConfig,
    result.source,
  );
  const articleAlternates = Object.fromEntries(
    Object.entries(canonicalAlternates).map(([target, url]) => [
      target,
      `${routePrefix}${new URL(url).pathname}`,
    ]),
  );

  return (
    <BlogSiteLayout
      config={config}
      routePrefix={routePrefix}
      locale={locale}
      articleAlternates={articleAlternates}
    >
      <BlogArticle
        config={config}
        routePrefix={routePrefix}
        locale={locale}
        source={result.source}
        translation={result.translation}
        isSourceFallback={result.isSourceFallback}
        canonical={canonical}
        copy={{
          untitledArticle: t("blog.untitledArticle"),
          readingTime: (minutes) => t("blog.readingTime", { minutes }),
          englishOnlyNotice: t("blog.englishOnlyNotice"),
          onThisPage: t("blog.onThisPage"),
          articleEnd: t("blog.articleEnd"),
          browseAll: t("blog.browseAll"),
        }}
      />
    </BlogSiteLayout>
  );
}
