import type { LegalSiteConfig } from "@/public-site/components/site";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

export const worldClockSiteConfig = {
  id: "world-clock",
  basePath: publicProjectBasePaths["world-clock"],
  name: "World Clock Plus",
  scopeClassName: "world-clock-site",
  routeProgressColor: "#007AFF",
  copyrightName: "ANMISOFT",
} satisfies LegalSiteConfig;
