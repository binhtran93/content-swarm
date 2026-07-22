import type { MetadataRoute } from "next";

import {
  getDedicatedPublicProjectId,
  getPublicRouteMode,
} from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

function getDedicatedConfig() {
  const projectId = getDedicatedPublicProjectId();
  switch (projectId) {
    case "jlens":
      return jlensSiteConfig;
    case "subiq":
      return subiqSiteConfig;
    case "urge-zero":
      return urgeZeroSiteConfig;
    default: {
      const exhaustive: never = projectId;
      throw new Error(`Unsupported dedicated public project: ${exhaustive}`);
    }
  }
}

export default function robots(): MetadataRoute.Robots {
  const dedicatedConfig =
    getPublicRouteMode() === "root" ? getDedicatedConfig() : undefined;

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
