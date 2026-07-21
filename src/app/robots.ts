import type { MetadataRoute } from "next";

import {
  getDedicatedPublicProjectId,
  getPublicRouteMode,
} from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export default function robots(): MetadataRoute.Robots {
  const dedicatedConfig =
    getPublicRouteMode() === "root"
      ? getDedicatedPublicProjectId() === "jlens"
        ? jlensSiteConfig
        : subiqSiteConfig
      : undefined;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/api/"],
    },
    ...(dedicatedConfig
      ? { sitemap: `${dedicatedConfig.canonicalOrigin}/sitemap.xml` }
      : {}),
  };
}
