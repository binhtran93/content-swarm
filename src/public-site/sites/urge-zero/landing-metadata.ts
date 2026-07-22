import type { Metadata } from "next";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { getUrgeZeroStaticLanguageAlternates } from "@/public-site/seo/urge-zero-static-localization";
import { getUrgeZeroTranslator } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const urgeZeroLandingTitle =
  "Quit Porn & Handle Urges in the Moment | UrgeZero";
export const urgeZeroLandingDescription =
  "UrgeZero gives you practical tools to handle porn urges, track streaks, block distractions, reset with breathing and focus games, and find support.";

export function createUrgeZeroLandingMetadata(
  locale: SupportedLocaleCode = defaultLocale,
): Metadata {
  const t = getUrgeZeroTranslator(locale);
  const title = t("seo.landingTitle");
  const description = t("seo.landingDescription");
  const canonical = getCanonicalUrl(urgeZeroSiteConfig, locale, "/");
  const socialImage = `${urgeZeroSiteConfig.canonicalOrigin}/og.png`;

  return {
    title,
    description,
    metadataBase: new URL(urgeZeroSiteConfig.canonicalOrigin),
    icons: getPublicSiteIcons(urgeZeroSiteConfig),
    alternates: {
      canonical,
      languages: getUrgeZeroStaticLanguageAlternates("/", true),
    },
    openGraph: {
      title,
      description,
      locale,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: t("seo.socialImageAlt"),
        },
      ],
      siteName: urgeZeroSiteConfig.brand.name,
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
