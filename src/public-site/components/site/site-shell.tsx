import { Suspense, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  findSupportedLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { SiteAnalytics } from "@/public-site/analytics/site-analytics";
import { isDedicatedSiteAnalyticsDeployment } from "@/public-site/analytics/site-analytics-policy";
import { AcquisitionHeaderCta } from "@/public-site/components/acquisition";
import type { PublicSiteConfig } from "@/public-site/config/site-config";
import { LanguageSelector } from "./language-selector";
import { MobileNavigation } from "./mobile-navigation";
import { SiteRouteTheme } from "./site-route-theme";

import styles from "./site-shell.module.css";

function withLocaleRoutePrefix(
  config: PublicSiteConfig,
  routePrefix: string,
  locale: SupportedLocaleCode,
  href: string,
) {
  if (/^(?:https?:|mailto:|tel:|#)/.test(href)) return href;
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  return `${routePrefix}${localePrefix}${href === "/" ? "/" : href}`;
}

export function SiteHeader({
  config,
  routePrefix,
  activeNavigationHref,
  accessory,
  locale = config.defaultLocale,
  languageMenuLabel = "Change language",
  articleAlternates,
}: {
  config: PublicSiteConfig;
  routePrefix: string;
  activeNavigationHref?: string;
  accessory?: ReactNode;
  locale?: SupportedLocaleCode;
  languageMenuLabel?: string;
  articleAlternates?: Partial<Record<SupportedLocaleCode, string>>;
}) {
  const hasLanguageSelector = config.locales.length > 1;

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link
          href={withLocaleRoutePrefix(config, routePrefix, locale, "/")}
          className={styles.brand}
          aria-label={
            config.accessibility?.brandHome ?? `${config.brand.name} home`
          }
        >
          <span className={styles.brandMark}>
            <Image
              src={config.brand.logoSrc}
              alt={config.brand.logoAlt}
              width={44}
              height={44}
              priority
            />
          </span>
          <span className={styles.brandName}>
            {config.brand.wordmarkLead}
            {config.brand.wordmarkAccent ? (
              <span className={styles.brandAccent}>
                {config.brand.wordmarkAccent}
              </span>
            ) : null}
          </span>
        </Link>

        <nav
          className={styles.primaryNav}
          aria-label={
            config.accessibility?.primaryNavigation ?? "Primary navigation"
          }
        >
          {config.navigation.map((item) => {
            const isActive = item.href === activeNavigationHref;
            const href = withLocaleRoutePrefix(
              config,
              routePrefix,
              locale,
              item.href,
            );

            const navigationProps = {
              className: isActive ? styles.activeNav : undefined,
              "aria-current": isActive ? ("page" as const) : undefined,
            };

            return href.includes("#") ? (
              <a href={href} key={item.label} {...navigationProps}>
                {item.label}
              </a>
            ) : (
              <Link href={href} key={item.label} {...navigationProps}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          {hasLanguageSelector ? (
            <div className={styles.headerLanguage}>
              <Suspense
                fallback={
                  <span className={styles.languageButton} aria-hidden="true">
                    {locale.split("-")[0]?.toUpperCase()}
                  </span>
                }
              >
                <LanguageSelector
                  locale={locale}
                  defaultLocale={config.defaultLocale}
                  enabledLocales={config.locales}
                  routePrefix={routePrefix}
                  label={languageMenuLabel}
                  articleAlternates={articleAlternates}
                />
              </Suspense>
            </div>
          ) : null}

          {config.headerCta.kind === "acquisition" ? (
            <AcquisitionHeaderCta
              badges={config.storeBadges}
              className={styles.headerCta}
              locale={locale}
              privacyHref={withLocaleRoutePrefix(
                config,
                routePrefix,
                locale,
                "/privacy",
              )}
              storeLabel={config.headerCta.label}
            />
          ) : config.headerCta.href.includes("#") ? (
            <a
              className={styles.headerCta}
              href={withLocaleRoutePrefix(
                config,
                routePrefix,
                locale,
                config.headerCta.href,
              )}
            >
              {config.headerCta.label}
            </a>
          ) : (
            <Link
              className={styles.headerCta}
              href={withLocaleRoutePrefix(
                config,
                routePrefix,
                locale,
                config.headerCta.href,
              )}
            >
              {config.headerCta.label}
            </Link>
          )}

          <MobileNavigation
            label={
              config.accessibility?.primaryNavigation ?? "Primary navigation"
            }
            items={config.navigation.map((item) => ({
              ...item,
              href: withLocaleRoutePrefix(
                config,
                routePrefix,
                locale,
                item.href,
              ),
              active: item.href === activeNavigationHref,
            }))}
            languageSelector={
              hasLanguageSelector ? (
                <Suspense
                  fallback={
                    <span className={styles.languageButton} aria-hidden="true">
                      {locale.split("-")[0]?.toUpperCase()}
                    </span>
                  }
                >
                  <LanguageSelector
                    locale={locale}
                    defaultLocale={config.defaultLocale}
                    enabledLocales={config.locales}
                    routePrefix={routePrefix}
                    label={languageMenuLabel}
                    articleAlternates={articleAlternates}
                    embedded
                  />
                </Suspense>
              ) : undefined
            }
          />
        </div>
      </div>
      {accessory}
    </header>
  );
}

export function SiteFooter({
  config,
  routePrefix,
  locale = config.defaultLocale,
}: {
  config: PublicSiteConfig;
  routePrefix: string;
  locale?: SupportedLocaleCode;
}) {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <Link
          href={withLocaleRoutePrefix(config, routePrefix, locale, "/")}
          className={styles.footerBrand}
          aria-label={config.accessibility?.backToTop ?? "Back to the top"}
        >
          <span className={styles.brandMark}>
            <Image src={config.brand.logoSrc} alt="" width={38} height={38} />
          </span>
          <strong>
            {config.brand.wordmarkLead}
            {config.brand.wordmarkAccent ? (
              <span className={styles.brandAccent}>
                {config.brand.wordmarkAccent}
              </span>
            ) : null}
          </strong>
        </Link>

        <nav
          aria-label={
            config.accessibility?.legalNavigation ?? "Legal and support"
          }
        >
          {config.footer.links.map((link) => (
            <Link
              href={withLocaleRoutePrefix(
                config,
                routePrefix,
                locale,
                link.href,
              )}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footerMeta}>
          <small>{config.footer.copyright}</small>
          {config.footer.disclaimer ? (
            <small>{config.footer.disclaimer}</small>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  config,
  routePrefix,
  activeNavigationHref,
  headerAccessory,
  locale = config.defaultLocale,
  languageMenuLabel,
  articleAlternates,
  children,
}: {
  config: PublicSiteConfig;
  routePrefix: string;
  activeNavigationHref?: string;
  headerAccessory?: ReactNode;
  locale?: SupportedLocaleCode;
  languageMenuLabel?: string;
  articleAlternates?: Partial<Record<SupportedLocaleCode, string>>;
  children: ReactNode;
}) {
  const localeConfig = findSupportedLocale(locale);
  const analyticsEnabled = isDedicatedSiteAnalyticsDeployment(
    config.id,
    process.env,
  );

  return (
    <div
      className={`${styles.page} ${config.scopeClassName}`}
      id="top"
      lang={locale}
      dir={localeConfig?.direction ?? "ltr"}
    >
      <SiteAnalytics
        enabled={analyticsEnabled}
        canonicalOrigin={config.canonicalOrigin}
        measurementId={config.analyticsMeasurementId}
      />
      <SiteRouteTheme progressColor={config.theme.routeProgressColor} />
      <SiteHeader
        config={config}
        routePrefix={routePrefix}
        activeNavigationHref={activeNavigationHref}
        accessory={headerAccessory}
        locale={locale}
        languageMenuLabel={languageMenuLabel}
        articleAlternates={articleAlternates}
      />
      {children}
      <SiteFooter config={config} routePrefix={routePrefix} locale={locale} />
    </div>
  );
}
