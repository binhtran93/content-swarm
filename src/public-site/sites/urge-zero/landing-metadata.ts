import type { Metadata } from "next";

import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const urgeZeroLandingTitle =
  "Quit Porn & Handle Urges in the Moment | UrgeZero";
export const urgeZeroLandingDescription =
  "UrgeZero gives you practical tools to handle porn urges, track streaks, block distractions, reset with breathing and focus games, and find support.";

export function createUrgeZeroLandingMetadata(): Metadata {
  const canonical = getCanonicalUrl(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    "/",
  );
  const socialImage = `${urgeZeroSiteConfig.canonicalOrigin}/og.png`;

  return {
    title: urgeZeroLandingTitle,
    description: urgeZeroLandingDescription,
    metadataBase: new URL(urgeZeroSiteConfig.canonicalOrigin),
    icons: getPublicSiteIcons(urgeZeroSiteConfig),
    alternates: { canonical },
    openGraph: {
      title: urgeZeroLandingTitle,
      description: urgeZeroLandingDescription,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "UrgeZero emergency plan for handling an urge in the moment",
        },
      ],
      siteName: urgeZeroSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: urgeZeroLandingTitle,
      description: urgeZeroLandingDescription,
      images: [socialImage],
    },
  };
}
