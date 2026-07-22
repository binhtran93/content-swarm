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
  getLocalizedUrgeZeroBlogConfig,
  urgeZeroBlogConfig,
} from "@/public-site/sites/urge-zero/blog-config";
import { getUrgeZeroTranslator } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { urgeZeroFontVariables } from "@/public-site/sites/urge-zero/site-layout";

import "./theme.css";

export async function UrgeZeroBlogArticlePage({
  locale,
  slug,
}: {
  locale: SupportedLocaleCode;
  slug: string;
}) {
  const config = getLocalizedUrgeZeroBlogConfig(locale);
  const t = getUrgeZeroTranslator(locale);
  const result = await loadBlogArticle({
    config: urgeZeroBlogConfig,
    locale,
    slug,
  });
  if (!result) notFound();
  const routePrefix = getProjectRoutePrefix(config);
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  if (result.redirectSlug)
    redirect(`${routePrefix}${localePrefix}/blog/${result.redirectSlug}`);
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
  const alternates = await loadArticleAlternates(
    urgeZeroBlogConfig,
    result.source,
  );
  const articleAlternates = Object.fromEntries(
    Object.entries(alternates).map(([target, url]) => [
      target,
      `${routePrefix}${new URL(url).pathname}`,
    ]),
  );
  return (
    <div className={urgeZeroFontVariables}>
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
    </div>
  );
}
