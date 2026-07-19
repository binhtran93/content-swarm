import type { SupportedLocaleCode } from "@/config/supported-locales";

export type SiteNavigationItem = {
  label: string;
  href: string;
};

export type SiteStoreBadge = {
  label: string;
  imageSrc: string;
  width: number;
  height: number;
  href?: string;
};

export type PublicSiteConfig = {
  id: string;
  internalBasePath: string;
  canonicalOrigin: string;
  defaultLocale: SupportedLocaleCode;
  locales: readonly SupportedLocaleCode[];
  scopeClassName: string;
  theme: {
    routeProgressColor: string;
  };
  brand: {
    name: string;
    wordmarkLead: string;
    wordmarkAccent?: string;
    logoSrc: string;
    logoAlt: string;
  };
  navigation: readonly SiteNavigationItem[];
  headerCta: SiteNavigationItem;
  footer: {
    links: readonly SiteNavigationItem[];
    copyright: string;
    disclaimer?: string;
  };
  storeBadges: readonly SiteStoreBadge[];
};
