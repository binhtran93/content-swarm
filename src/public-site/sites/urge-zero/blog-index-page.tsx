import { defaultLocale } from "@/config/supported-locales";
import { loadBlogPage } from "@/public-site/blog/load-blog-page.server";
import { BlogIndex } from "@/public-site/components/blog/blog-index";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";

import "./theme.css";

export async function UrgeZeroBlogIndexPage({
  topic,
  cursor,
}: {
  topic?: string;
  cursor?: string;
}) {
  const routePrefix = getProjectRoutePrefix(urgeZeroBlogConfig);
  const result = await loadBlogPage({
    config: urgeZeroBlogConfig,
    locale: defaultLocale,
    topic,
    cursor,
  });

  return (
    <BlogSiteLayout
      config={urgeZeroBlogConfig}
      locale={defaultLocale}
      routePrefix={routePrefix}
    >
      <BlogIndex
        activeTopic={topic}
        config={urgeZeroBlogConfig}
        copy={{
          articlesLabel: "UrgeZero guides",
          browseByTopic: "Browse by topic",
          allTopics: "All topics",
          englishOnlyShort: "Available in English",
          emptyTitle: "Guides are coming soon",
          emptyDescription:
            "We’re preparing practical guides for urges, habits, setbacks, and steady progress",
          paginationLabel: "Blog pagination",
          nextPage: "Next page",
        }}
        locale={defaultLocale}
        result={result}
        routePrefix={routePrefix}
      />
    </BlogSiteLayout>
  );
}
