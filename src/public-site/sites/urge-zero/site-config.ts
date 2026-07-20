import type { LegalSiteConfig } from "@/public-site/components/site";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

export const urgeZeroSiteConfig = {
  id: "urge-zero",
  basePath: publicProjectBasePaths["urge-zero"],
  name: "Urge Zero",
  logoSrc: "/urge-zero/logo.png",
  scopeClassName: "urge-zero-site",
  routeProgressColor: "#BE9050",
  copyrightName: "ANMISOFT",
} satisfies LegalSiteConfig;
