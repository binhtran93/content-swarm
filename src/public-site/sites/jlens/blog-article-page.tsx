import { notFound, redirect } from "next/navigation";

import { defaultLocale } from "@/config/supported-locales";
import { loadBlogArticle } from "@/public-site/blog/load-blog-article.server";
import { BlogArticle } from "@/public-site/components/blog/blog-article";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import {
  getCanonicalUrl,
  getProjectRoutePrefix,
} from "@/public-site/config/public-url";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";

import "./theme.css";

export async function JlensBlogArticlePage({ slug }: { slug: string }) {
  const result = await loadBlogArticle({
    config: jlensBlogConfig,
    locale: defaultLocale,
    slug,
  });
  if (!result) notFound();

  const routePrefix = getProjectRoutePrefix(jlensBlogConfig);
  if (result.redirectSlug) {
    redirect(`${routePrefix}/blog/${result.redirectSlug}`);
  }

  const canonical = getCanonicalUrl(
    jlensBlogConfig,
    defaultLocale,
    `/blog/${result.source.slug}`,
  );

  return (
    <BlogSiteLayout
      config={jlensBlogConfig}
      routePrefix={routePrefix}
      locale={defaultLocale}
    >
      <BlogArticle
        config={jlensBlogConfig}
        routePrefix={routePrefix}
        locale={defaultLocale}
        source={result.source}
        translation={result.translation}
        isSourceFallback={result.isSourceFallback}
        canonical={canonical}
        copy={{
          untitledArticle: "Untitled jewelry guide",
          readingTime: (minutes) => `${minutes} min read`,
          englishOnlyNotice: "This guide is currently available in English.",
          onThisPage: "On this page",
          articleEnd: "End of guide",
          browseAll: "Browse all jewelry guides",
        }}
      />
    </BlogSiteLayout>
  );
}
