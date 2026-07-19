import type { Metadata } from "next";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { getCanonicalUrl } from "@/public-site/config/public-url";

export function createBlogIndexMetadata(
  config: PublicBlogConfig,
  locale: SupportedLocaleCode,
  hasVariant = false,
): Metadata {
  const canonical = getCanonicalUrl(config, locale, "/blog");
  return {
    title: `${config.blog.titleLead} ${config.blog.titleAccent} — ${config.brand.name}`,
    description: config.blog.description,
    alternates: { canonical },
    robots: hasVariant ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${config.blog.titleLead} ${config.blog.titleAccent}`,
      description: config.blog.description,
      siteName: config.brand.name,
      type: "website",
      url: canonical,
    },
  };
}
