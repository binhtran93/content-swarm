import { defaultLocale } from "@/config/supported-locales";
import { loadBlogPage } from "@/public-site/blog/load-blog-page.server";
import { BlogIndex } from "@/public-site/components/blog/blog-index";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";

import "./theme.css";

export async function JlensBlogIndexPage({
  topic,
  cursor,
}: {
  topic?: string;
  cursor?: string;
}) {
  const routePrefix = getProjectRoutePrefix(jlensBlogConfig);
  const result = await loadBlogPage({
    config: jlensBlogConfig,
    locale: defaultLocale,
    topic,
    cursor,
  });

  return (
    <BlogSiteLayout
      config={jlensBlogConfig}
      routePrefix={routePrefix}
      locale={defaultLocale}
    >
      <BlogIndex
        config={jlensBlogConfig}
        routePrefix={routePrefix}
        locale={defaultLocale}
        result={result}
        activeTopic={topic}
        copy={{
          articlesLabel: "Jewelry guides",
          browseByTopic: "Browse by topic",
          allTopics: "All topics",
          englishOnlyShort: "Available in English",
          emptyTitle: "Guides are coming soon",
          emptyDescription:
            "We’re preparing practical jewelry identification and care guides.",
          paginationLabel: "Blog pagination",
          nextPage: "Next page",
        }}
      />
    </BlogSiteLayout>
  );
}
