import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

const title = "SubIQ — Take control of every subscription";
const description =
  "Track recurring expenses, stay ahead of renewals and trials, and find clear cancellation and refund guidance with SubIQ";

export function createSubiqLandingMetadata(
  locale: SupportedLocaleCode,
): Metadata {
  const isFallback = locale !== subiqSiteConfig.defaultLocale;
  const canonical = getCanonicalUrl(
    subiqSiteConfig,
    subiqSiteConfig.defaultLocale,
    "/",
  );
  return {
    title,
    description,
    keywords: [
      "subscription tracker",
      "recurring expenses",
      "renewal reminders",
      "trial reminders",
      "cancellation guide",
    ],
    alternates: { canonical },
    robots: isFallback ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      siteName: "SubIQ",
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
