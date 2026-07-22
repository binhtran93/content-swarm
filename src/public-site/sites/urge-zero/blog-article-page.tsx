import { notFound, redirect } from "next/navigation";

import { defaultLocale } from "@/config/supported-locales";
import { loadBlogArticle } from "@/public-site/blog/load-blog-article.server";
import { BlogArticle } from "@/public-site/components/blog/blog-article";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import {
  getCanonicalUrl,
  getProjectRoutePrefix,
} from "@/public-site/config/public-url";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";

import "./theme.css";

export async function UrgeZeroBlogArticlePage({ slug }: { slug: string }) {
  const result = await loadBlogArticle({
    config: urgeZeroBlogConfig,
    locale: defaultLocale,
    slug,
  });
  if (!result) notFound();

  const routePrefix = getProjectRoutePrefix(urgeZeroBlogConfig);
  if (result.redirectSlug) {
    redirect(`${routePrefix}/blog/${result.redirectSlug}`);
  }

  const canonical = getCanonicalUrl(
    urgeZeroBlogConfig,
    defaultLocale,
    `/blog/${result.source.slug}`,
  );

  return (
    <BlogSiteLayout
      config={urgeZeroBlogConfig}
      locale={defaultLocale}
      routePrefix={routePrefix}
    >
      <BlogArticle
        canonical={canonical}
        config={urgeZeroBlogConfig}
        copy={{
          untitledArticle: "Untitled UrgeZero guide",
          readingTime: (minutes) => `${minutes} min read`,
          englishOnlyNotice: "This guide is currently available in English",
          onThisPage: "On this page",
          articleEnd: "End of guide",
          browseAll: "Browse all UrgeZero guides",
        }}
        isSourceFallback={result.isSourceFallback}
        locale={defaultLocale}
        routePrefix={routePrefix}
        source={result.source}
        translation={result.translation}
      />
    </BlogSiteLayout>
  );
}
