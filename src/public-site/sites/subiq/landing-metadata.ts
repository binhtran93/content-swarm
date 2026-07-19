import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

const title = "SubIQ: Subscription Tracker & Renewal Reminders";
const description =
  "Track subscriptions, recurring expenses, renewal dates, and free trials in one place. Get reminders, spending insights, and step-by-step cancellation guides.";

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
    icons: getPublicSiteIcons(subiqSiteConfig),
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
