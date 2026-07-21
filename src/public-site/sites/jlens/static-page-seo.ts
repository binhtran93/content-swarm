import type { Metadata } from "next";

import { getCanonicalUrl } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

const pages = {
  support: {
    title: "Support | JLens",
    description: "Contact JLens support and learn how to report an issue.",
  },
  privacy: {
    title: "Privacy Policy | JLens",
    description: "Privacy policy for the JLens jewelry identifier app.",
  },
  terms: {
    title: "Terms and Conditions | JLens",
    description: "Terms and conditions for the JLens jewelry identifier app.",
  },
} as const;

export function createJlensStaticPageMetadata(
  page: keyof typeof pages,
): Metadata {
  const value = pages[page];
  const canonical = getCanonicalUrl(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    `/${page}`,
  );

  return {
    ...value,
    alternates: { canonical },
    openGraph: {
      ...value,
      siteName: jlensSiteConfig.brand.name,
      type: "website",
      url: canonical,
    },
  };
}
