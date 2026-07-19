import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import {
  getSubiqStaticCanonicalLocale,
  getSubiqStaticLanguageAlternates,
} from "@/public-site/seo/subiq-static-localization";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import {
  getSubiqTranslator,
  isSubiqStaticLocale,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

const pages = {
  support: {
    localized: true,
  },
  privacy: {
    localized: false,
    title: "Privacy Policy | SubIQ",
    description: "Privacy policy for the SubIQ subscription tracking app.",
  },
  terms: {
    localized: false,
    title: "Terms and Conditions | SubIQ",
    description:
      "Terms and conditions for the SubIQ subscription tracking app.",
  },
} as const;

export function createSubiqStaticPageMetadata(
  page: keyof typeof pages,
  locale: SupportedLocaleCode,
): Metadata {
  const definition = pages[page];
  const { localized, ...englishValue } = definition;
  const enabled = isSubiqStaticLocale(locale);
  const t = getSubiqTranslator(locale);
  const value = localized
    ? {
        title: t("seo.supportTitle"),
        description: t("seo.supportDescription"),
      }
    : englishValue;
  const path = `/${page}`;
  const canonicalLocale = getSubiqStaticCanonicalLocale(locale, localized);
  return {
    ...value,
    alternates: {
      canonical: getCanonicalUrl(subiqSiteConfig, canonicalLocale, path),
      languages: getSubiqStaticLanguageAlternates(path, localized),
    },
    robots:
      (!localized && locale !== subiqSiteConfig.defaultLocale) || !enabled
        ? { index: false, follow: true }
        : undefined,
  };
}
