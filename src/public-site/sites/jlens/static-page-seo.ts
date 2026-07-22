import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import {
  getJlensStaticCanonicalLocale,
  getJlensStaticLanguageAlternates,
} from "@/public-site/seo/jlens-static-localization";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import {
  getJlensTranslator,
  isJlensStaticLocale,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

const pages = {
  support: {
    localized: true,
  },
  privacy: {
    localized: false,
    title: "Privacy Policy | JLens",
    description: "Privacy policy for the JLens jewelry identifier app.",
  },
  terms: {
    localized: false,
    title: "Terms and Conditions | JLens",
    description: "Terms and conditions for the JLens jewelry identifier app.",
  },
} as const;

export function createJlensStaticPageMetadata(
  page: keyof typeof pages,
  locale: SupportedLocaleCode,
): Metadata {
  const definition = pages[page];
  const { localized, ...englishValue } = definition;
  const enabled = isJlensStaticLocale(locale);
  const t = getJlensTranslator(locale);
  const value = localized
    ? {
        title: t("seo.supportTitle"),
        description: t("seo.supportDescription"),
      }
    : englishValue;
  const path = `/${page}`;
  const canonicalLocale = getJlensStaticCanonicalLocale(locale, localized);
  const canonical = getCanonicalUrl(jlensSiteConfig, canonicalLocale, path);

  return {
    ...value,
    alternates: {
      canonical,
      languages: getJlensStaticLanguageAlternates(path, localized),
    },
    robots:
      (!localized && locale !== jlensSiteConfig.defaultLocale) || !enabled
        ? { index: false, follow: true }
        : undefined,
    openGraph: {
      ...value,
      siteName: jlensSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
  };
}
