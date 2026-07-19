import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import {
  getSubiqStaticCanonicalLocale,
  getSubiqStaticLanguageAlternates,
} from "@/public-site/seo/subiq-static-localization";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import {
  getSubiqTranslator,
  isSubiqStaticLocale,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

export function createSubiqLandingMetadata(
  locale: SupportedLocaleCode,
): Metadata {
  const enabled = isSubiqStaticLocale(locale);
  const t = getSubiqTranslator(locale);
  const title = t("seo.landingTitle");
  const description = t("seo.landingDescription");
  const canonical = getCanonicalUrl(
    subiqSiteConfig,
    getSubiqStaticCanonicalLocale(locale, true),
    "/",
  );
  return {
    title,
    description,
    icons: getPublicSiteIcons(subiqSiteConfig),
    alternates: {
      canonical,
      languages: getSubiqStaticLanguageAlternates("/", true),
    },
    robots: enabled ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      siteName: subiqSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
