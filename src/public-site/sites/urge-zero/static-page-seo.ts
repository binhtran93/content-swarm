import type { Metadata } from "next";

import { getCanonicalUrl } from "@/public-site/config/public-url";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

const pages = {
  support: {
    title: "Support | UrgeZero",
    description: "Contact UrgeZero support and learn how to report an issue.",
  },
  privacy: {
    title: "Privacy Policy | UrgeZero",
    description: "Privacy policy for the UrgeZero app and website.",
  },
  terms: {
    title: "Terms and Conditions | UrgeZero",
    description: "Terms and conditions for the UrgeZero app and website.",
  },
} as const;

export function createUrgeZeroStaticPageMetadata(
  page: keyof typeof pages,
): Metadata {
  const value = pages[page];
  const canonical = getCanonicalUrl(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    `/${page}`,
  );

  return {
    ...value,
    metadataBase: new URL(urgeZeroSiteConfig.canonicalOrigin),
    alternates: { canonical },
    openGraph: {
      ...value,
      siteName: urgeZeroSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
  };
}
