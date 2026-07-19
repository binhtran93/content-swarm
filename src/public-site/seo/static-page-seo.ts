import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

const pages = {
  support: {
    title: "Support | SubIQ",
    description:
      "Get help with SubIQ subscription tracking, reminders, currency estimates, and guidance tools.",
  },
  privacy: {
    title: "Privacy Policy | SubIQ",
    description: "Privacy policy for the SubIQ subscription tracking app.",
  },
  terms: {
    title: "Terms and Conditions | SubIQ",
    description:
      "Terms and conditions for the SubIQ subscription tracking app.",
  },
} as const;

export function createSubiqStaticPageMetadata(
  page: keyof typeof pages,
  locale: SupportedLocaleCode,
): Metadata {
  const value = pages[page];
  return {
    ...value,
    alternates: {
      canonical: getCanonicalUrl(
        subiqSiteConfig,
        subiqSiteConfig.defaultLocale,
        `/${page}`,
      ),
    },
    robots:
      locale === subiqSiteConfig.defaultLocale
        ? undefined
        : { index: false, follow: true },
  };
}
