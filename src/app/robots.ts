import type { MetadataRoute } from "next";

import { getPublicRouteMode } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export default function robots(): MetadataRoute.Robots {
  const dedicatedSubiqDeployment =
    getPublicRouteMode() === "root" &&
    process.env.PUBLIC_PROJECT_ID === subiqSiteConfig.id;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/api/"],
    },
    ...(dedicatedSubiqDeployment
      ? { sitemap: `${subiqSiteConfig.canonicalOrigin}/sitemap.xml` }
      : {}),
  };
}
