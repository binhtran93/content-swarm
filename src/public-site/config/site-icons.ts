import type { Metadata } from "next";

import type { PublicSiteConfig } from "@/public-site/config/site-config";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";

export function getPublicSiteIcons(
  config: PublicSiteConfig,
): Metadata["icons"] {
  const routePrefix = getProjectRoutePrefix(config);
  const favicon = `${routePrefix}/favicon.png`;

  return {
    icon: [{ url: favicon, type: "image/png" }],
    shortcut: favicon,
    apple: [{ url: favicon, type: "image/png" }],
  };
}
