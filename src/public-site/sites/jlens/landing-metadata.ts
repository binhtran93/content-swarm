import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import {
  getJlensStaticCanonicalLocale,
  getJlensStaticLanguageAlternates,
} from "@/public-site/seo/jlens-static-localization";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import {
  getJlensTranslator,
  isJlensStaticLocale,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

export function createJlensLandingMetadata(
  locale: SupportedLocaleCode,
): Metadata {
  const enabled = isJlensStaticLocale(locale);
  const t = getJlensTranslator(locale);
  const title = t("seo.landingTitle");
  const description = t("seo.landingDescription");
  const canonical = getCanonicalUrl(
    jlensSiteConfig,
    getJlensStaticCanonicalLocale(locale, true),
    "/",
  );
  const socialImage = `${jlensSiteConfig.canonicalOrigin}/og.png`;

  return {
    title,
    description,
    icons: getPublicSiteIcons(jlensSiteConfig),
    alternates: {
      canonical,
      languages: getJlensStaticLanguageAlternates("/", true),
    },
    robots: enabled ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "JLens AI jewelry identifier",
        },
      ],
      siteName: jlensSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
