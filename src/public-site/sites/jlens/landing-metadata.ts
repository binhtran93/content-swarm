import type { Metadata } from "next";

import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export const jlensLandingTitle =
  "AI Jewelry Identifier & Value Estimator | JLens";
export const jlensLandingDescription =
  "Identify jewelry from a photo with JLens. Explore likely metals, gemstones, hallmarks, styles, and estimated value ranges, then save pieces and ask questions.";

export function createJlensLandingMetadata(): Metadata {
  const canonical = getCanonicalUrl(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    "/",
  );
  const socialImage = `${jlensSiteConfig.canonicalOrigin}/og.png`;

  return {
    title: jlensLandingTitle,
    description: jlensLandingDescription,
    icons: getPublicSiteIcons(jlensSiteConfig),
    alternates: { canonical },
    openGraph: {
      title: jlensLandingTitle,
      description: jlensLandingDescription,
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
      title: jlensLandingTitle,
      description: jlensLandingDescription,
      images: [socialImage],
    },
  };
}
