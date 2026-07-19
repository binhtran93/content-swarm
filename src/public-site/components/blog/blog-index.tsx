import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import styles from "./blog.module.css";

type BlogPage = Awaited<
  ReturnType<
    typeof import("@/public-site/blog/load-blog-page.server").loadBlogPage
  >
>;

export type BlogIndexCopy = {
  articlesLabel: string;
  browseByTopic: string;
  allTopics: string;
  defaultTopic: string;
  englishOnlyShort: string;
  emptyTitle: string;
  emptyDescription: string;
  paginationLabel: string;
  nextPage: string;
};

function formatDate(value: string, locale: SupportedLocaleCode) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function routeHref(
  config: PublicBlogConfig,
  routePrefix: string,
  locale: SupportedLocaleCode,
  path: string,
) {
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  return `${routePrefix}${localePrefix}${path}`;
}

export function BlogIndex({
  config,
  routePrefix,
  locale,
  result,
  activeTopic,
  copy,
}: {
  config: PublicBlogConfig;
  routePrefix: string;
  locale: SupportedLocaleCode;
  result: BlogPage;
  activeTopic?: string;
  copy: BlogIndexCopy;
}) {
  const blogHref = routeHref(config, routePrefix, locale, "/blog");
  return (
    <main>
      <section className={styles.blogHero} aria-labelledby="blog-title">
        <div className={styles.contentShell}>
          <h1 id="blog-title">
            {config.blog.titleLead} <span>{config.blog.titleAccent}</span>
          </h1>
          <p className={styles.heroDescription}>{config.blog.description}</p>
        </div>
      </section>

      <section className={styles.blogContent} aria-label={copy.articlesLabel}>
        <div className={styles.contentShell}>
          <div className={styles.articleBrowser}>
            <aside
              className={styles.filterRail}
              aria-label={copy.browseByTopic}
            >
              <p className={styles.browserLabel}>{copy.browseByTopic}</p>
              <div className={styles.categoryList}>
                <Link
                  className={!activeTopic ? styles.activeCategory : undefined}
                  href={blogHref}
                >
                  {copy.allTopics}
                </Link>
                {result.topics.map((topic) => (
                  <Link
                    className={
                      activeTopic === topic ? styles.activeCategory : undefined
                    }
                    href={`${blogHref}?topic=${encodeURIComponent(topic)}`}
                    key={topic}
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </aside>

            <section className={styles.articleArchive} id="article-list">
              {result.items.length ? (
                <div className={styles.articleList}>
                  {result.items.map((article) => (
                    <Link
                      href={routeHref(
                        config,
                        routePrefix,
                        locale,
                        `/blog/${article.slug}`,
                      )}
                      className={styles.articleRow}
                      key={article.id}
                    >
                      <div className={styles.articleContent}>
                        <div className={styles.articleMeta}>
                          <span>{article.topics[0] ?? copy.defaultTopic}</span>
                          <time dateTime={article.updatedAt}>
                            {formatDate(article.updatedAt, locale)}
                          </time>
                        </div>
                        <h3>{article.title}</h3>
                        {article.isSourceFallback ? (
                          <small>{copy.englishOnlyShort}</small>
                        ) : null}
                        {article.excerpt ? <p>{article.excerpt}</p> : null}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3>{copy.emptyTitle}</h3>
                  <p>{copy.emptyDescription}</p>
                </div>
              )}

              {result.hasNext && result.nextCursor ? (
                <nav
                  className={styles.pagination}
                  aria-label={copy.paginationLabel}
                >
                  <Link
                    href={`${blogHref}?${new URLSearchParams({
                      ...(activeTopic ? { topic: activeTopic } : {}),
                      cursor: result.nextCursor,
                    })}`}
                  >
                    {copy.nextPage}
                  </Link>
                </nav>
              ) : null}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
