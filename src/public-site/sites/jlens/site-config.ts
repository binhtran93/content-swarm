import type { LegalSiteConfig } from "@/public-site/components/site";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

export const jlensSiteConfig = {
  id: "jlens",
  basePath: publicProjectBasePaths.jlens,
  name: "JLens",
  logoSrc: "/jlens/logo.png",
  scopeClassName: "jlens-site",
  routeProgressColor: "#8F7439",
  copyrightName: "ANMISOFT",
} satisfies LegalSiteConfig;
