import type { ReactNode } from "react";

import { LegalSiteShell } from "@/public-site/components/site";
import { worldClockSiteConfig } from "@/public-site/sites/world-clock/site-config";

import "@/public-site/sites/world-clock/theme.css";

export default function WorldClockLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LegalSiteShell config={worldClockSiteConfig}>{children}</LegalSiteShell>
  );
}
