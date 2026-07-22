import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import {
  getUrgeZeroStaticCanonicalLocale,
  getUrgeZeroStaticLanguageAlternates,
} from "@/public-site/seo/urge-zero-static-localization";
import {
  getUrgeZeroTranslator,
  isUrgeZeroStaticLocale,
} from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

const pages = {
  support: { localized: true },
  privacy: {
    localized: false,
    title: "Privacy Policy | UrgeZero",
    description: "Privacy policy for the UrgeZero app and website.",
  },
  terms: {
    localized: false,
    title: "Terms and Conditions | UrgeZero",
    description: "Terms and conditions for the UrgeZero app and website.",
  },
} as const;

export function createUrgeZeroStaticPageMetadata(
  page: keyof typeof pages,
  locale: SupportedLocaleCode,
): Metadata {
  const definition = pages[page];
  const { localized, ...englishValue } = definition;
  const enabled = isUrgeZeroStaticLocale(locale);
  const t = getUrgeZeroTranslator(locale);
  const value = localized
    ? { title: t("seo.supportTitle"), description: t("seo.supportDescription") }
    : englishValue;
  const path = `/${page}`;
  const canonicalLocale = getUrgeZeroStaticCanonicalLocale(locale, localized);
  const canonical = getCanonicalUrl(urgeZeroSiteConfig, canonicalLocale, path);
  return {
    ...value,
    metadataBase: new URL(urgeZeroSiteConfig.canonicalOrigin),
    alternates: {
      canonical,
      languages: getUrgeZeroStaticLanguageAlternates(path, localized),
    },
    robots:
      (!localized && locale !== urgeZeroSiteConfig.defaultLocale) || !enabled
        ? { index: false, follow: true }
        : undefined,
    openGraph: {
      ...value,
      siteName: urgeZeroSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
  };
}
