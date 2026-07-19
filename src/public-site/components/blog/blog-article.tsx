import Image from "next/image";
import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { Article } from "@/features/articles/model/article";
import type { Translation } from "@/features/articles/model/translation";
import articleContentStyles from "@/features/articles/presentation/article-content.module.css";
import type { ArticleHeading } from "@/public-site/components/mdx/article-mdx-outline";
import { renderArticleMdx } from "@/public-site/components/mdx/render-article-mdx.server";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { getPublicTranslator } from "@/public-site/i18n/get-public-translator";
import styles from "./blog.module.css";

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
}: {
  config: PublicBlogConfig;
  routePrefix: string;
  locale: SupportedLocaleCode;
  source: Article;
  translation: Translation | null;
  isSourceFallback: boolean;
  canonical: string;
}) {
  const title = translation?.title ?? source.title ?? "Untitled article";
  const excerpt = translation?.excerpt ?? source.excerpt ?? "";
  const content = translation?.content ?? source.content ?? "";
  const renderedArticle = await renderArticleMdx(content);
  const t = getPublicTranslator();
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
                <span>{source.topics[0] ?? "Guide"}</span>
                <time dateTime={updatedAt}>
                  {new Intl.DateTimeFormat(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(updatedAt))}
                </time>
                <span>{readingMinutes} min read</span>
              </div>
              <h1>{title}</h1>
              {excerpt ? <p className={styles.articleDek}>{excerpt}</p> : null}
              {isSourceFallback ? (
                <p role="note" className={styles.fallbackNotice}>
                  This article is currently available in English only.
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
                  aria-label={t("blog.onThisPage")}
                >
                  <p>{t("blog.onThisPage")}</p>
                  <ArticleSectionLinks headings={renderedArticle.headings} />
                </aside>
                <details className={styles.mobileTableOfContents}>
                  <summary>{t("blog.onThisPage")}</summary>
                  <ArticleSectionLinks headings={renderedArticle.headings} />
                </details>
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
                <div className={styles.installCtaActions}>
                  {config.storeBadges.map((badge) => (
                    <span className={styles.installCtaLink} key={badge.label}>
                      <Image
                        src={badge.imageSrc}
                        alt=""
                        width={badge.width}
                        height={badge.height}
                        className={styles.installCtaBadge}
                      />
                    </span>
                  ))}
                </div>
              </section>
              <div className={styles.articleEnd}>
                <p>
                  Use this guide whenever your recurring costs stop feeling
                  clear.
                </p>
                <Link href={routeHref(config, routePrefix, locale, "/blog")}>
                  Browse all articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
