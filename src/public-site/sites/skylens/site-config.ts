import type { LegalSiteConfig } from "@/public-site/components/site";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

export const skylensSiteConfig = {
  id: "skylens",
  basePath: publicProjectBasePaths.skylens,
  name: "SkyLens",
  logoSrc: "/skylens/logo.png",
  scopeClassName: "skylens-site",
  routeProgressColor: "#C05A2A",
  copyrightName: "ANMISOFT",
} satisfies LegalSiteConfig;
