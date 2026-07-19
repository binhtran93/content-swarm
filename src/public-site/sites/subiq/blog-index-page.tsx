import type { SupportedLocaleCode } from "@/config/supported-locales";
import { loadBlogPage } from "@/public-site/blog/load-blog-page.server";
import { BlogIndex } from "@/public-site/components/blog/blog-index";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import {
  getLocalizedSubiqBlogConfig,
  subiqBlogConfig,
} from "@/public-site/sites/subiq/blog-config";
import { getSubiqMessages } from "@/public-site/sites/subiq/i18n/get-subiq-translator";

import "./theme.css";

export async function SubiqBlogIndexPage({
  locale,
  topic,
  cursor,
}: {
  locale: SupportedLocaleCode;
  topic?: string;
  cursor?: string;
}) {
  const config = getLocalizedSubiqBlogConfig(locale);
  const messages = getSubiqMessages(locale);
  const routePrefix = getProjectRoutePrefix(config);
  const result = await loadBlogPage({
    config: subiqBlogConfig,
    locale,
    topic,
    cursor,
  });
  return (
    <BlogSiteLayout config={config} routePrefix={routePrefix} locale={locale}>
      <BlogIndex
        config={config}
        routePrefix={routePrefix}
        locale={locale}
        result={result}
        activeTopic={topic}
        copy={{
          articlesLabel: messages.blog.articlesLabel,
          browseByTopic: messages.blog.browseByTopic,
          allTopics: messages.blog.allTopics,
          defaultTopic: messages.blog.defaultTopic,
          englishOnlyShort: messages.blog.englishOnlyShort,
          emptyTitle: messages.blog.emptyTitle,
          emptyDescription: messages.blog.emptyDescription,
          paginationLabel: messages.blog.paginationLabel,
          nextPage: messages.blog.nextPage,
        }}
      />
    </BlogSiteLayout>
  );
}
