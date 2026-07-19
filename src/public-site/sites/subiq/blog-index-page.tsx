import type { SupportedLocaleCode } from "@/config/supported-locales";
import { loadBlogPage } from "@/public-site/blog/load-blog-page.server";
import { BlogIndex } from "@/public-site/components/blog/blog-index";
import { BlogSiteLayout } from "@/public-site/components/blog/blog-site-layout";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";
import { getLocalizedSubiqConfig } from "@/public-site/sites/subiq/site-config";

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
  const config = {
    ...subiqBlogConfig,
    ...getLocalizedSubiqConfig(locale),
    blog: subiqBlogConfig.blog,
  };
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
      />
    </BlogSiteLayout>
  );
}
