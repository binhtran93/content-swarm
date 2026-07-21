import type { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/support", "/privacy", "/terms"].map((path) => ({
    url: getCanonicalUrl(jlensSiteConfig, jlensSiteConfig.defaultLocale, path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.4,
  }));
}
