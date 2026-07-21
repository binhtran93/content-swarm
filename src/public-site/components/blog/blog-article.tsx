import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { Article } from "@/features/articles/model/article";
import type { Translation } from "@/features/articles/model/translation";
import articleContentStyles from "@/features/articles/presentation/article-content.module.css";
import { AcquisitionActions } from "@/public-site/components/acquisition";
import type { ArticleHeading } from "@/public-site/components/mdx/article-mdx-outline";
import { renderArticleMdx } from "@/public-site/components/mdx/render-article-mdx.server";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import styles from "./blog.module.css";

export type BlogArticleCopy = {
  untitledArticle: string;
  readingTime: (minutes: number) => string;
  englishOnlyNotice: string;
  onThisPage: string;
  articleEnd: string;
  browseAll: string;
};

function routeHref(
  config: PublicBlogConfig,
  routePrefix: string,
  locale: SupportedLocaleCode,
  path: string,
) {
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  return `${routePrefix}${localePrefix}${path}`;
}

function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function ArticleSectionLinks({ headings }: { headings: ArticleHeading[] }) {
  return (
    <ol>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`}>{heading.label}</a>
        </li>
      ))}
    </ol>
  );
}

export async function BlogArticle({
  config,
  routePrefix,
  locale,
  source,
  translation,
  isSourceFallback,
  canonical,
  copy,
}: {
  config: PublicBlogConfig;
  routePrefix: string;
  locale: SupportedLocaleCode;
  source: Article;
  translation: Translation | null;
  isSourceFallback: boolean;
  canonical: string;
  copy: BlogArticleCopy;
}) {
  const title = translation?.title ?? source.title ?? copy.untitledArticle;
  const excerpt = translation?.excerpt ?? source.excerpt ?? "";
  const content = translation?.content ?? source.content ?? "";
  const renderedArticle = await renderArticleMdx(content);
  const updatedAt = translation?.updatedAt ?? source.updatedAt;
  const readingMinutes = Math.max(
    1,
    Math.ceil(content.split(/\s+/).length / 220),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: source.createdAt,
    dateModified: updatedAt,
    inLanguage: translation?.locale ?? source.locale,
    mainEntityOfPage: canonical,
    publisher: { "@type": "Organization", name: config.brand.name },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <article>
        <header className={styles.articleHero}>
          <div className={styles.contentShell}>
            <div className={styles.articleHeroInner}>
              <div className={styles.articleMeta}>
                {source.topics[0] ? <span>{source.topics[0]}</span> : null}
                <time dateTime={updatedAt}>
                  {new Intl.DateTimeFormat(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(updatedAt))}
                </time>
                <span>{copy.readingTime(readingMinutes)}</span>
              </div>
              <h1>{title}</h1>
              {excerpt ? <p className={styles.articleDek}>{excerpt}</p> : null}
              {isSourceFallback ? (
                <p role="note" className={styles.fallbackNotice}>
                  {copy.englishOnlyNotice}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className={styles.articleBody}>
          <div className={`${styles.contentShell} ${styles.articleLayout}`}>
            {renderedArticle.headings.length ? (
              <>
                <aside
                  className={styles.tableOfContents}
                  aria-label={copy.onThisPage}
                >
                  <p>{copy.onThisPage}</p>
                  <ArticleSectionLinks headings={renderedArticle.headings} />
                </aside>
                <aside
                  className={styles.mobileTableOfContents}
                  aria-label={copy.onThisPage}
                >
                  <p>{copy.onThisPage}</p>
                  <ArticleSectionLinks headings={renderedArticle.headings} />
                </aside>
              </>
            ) : null}
            <div className={`${styles.prose} ${articleContentStyles.content}`}>
              {renderedArticle.content}
              <section
                className={styles.installCta}
                aria-labelledby="article-install-title"
              >
                <div className={styles.installCtaCopy}>
                  <p className={styles.installCtaEyebrow}>
                    {config.blog.installCta.eyebrow}
                  </p>
                  <h2 id="article-install-title">
                    {config.blog.installCta.title}
                  </h2>
                  <p className={styles.installCtaDescription}>
                    {config.blog.installCta.description}
                  </p>
                </div>
                <AcquisitionActions
                  badges={config.storeBadges}
                  className={styles.installCtaActions}
                  locale={locale}
                  privacyHref={routeHref(
                    config,
                    routePrefix,
                    locale,
                    "/privacy",
                  )}
                  source="blog"
                />
              </section>
              <div className={styles.articleEnd}>
                <p>{copy.articleEnd}</p>
                <Link href={routeHref(config, routePrefix, locale, "/blog")}>
                  {copy.browseAll}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
