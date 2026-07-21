import { Bodoni_Moda } from "next/font/google";
import type { ReactNode } from "react";

import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

import "./theme.css";

const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-jlens-display",
  weight: ["500", "600", "700"],
});

export function JlensSiteLayout({
  activeNavigationHref,
  children,
}: {
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <div className={displayFont.variable}>
      <SiteShell
        activeNavigationHref={activeNavigationHref}
        config={jlensSiteConfig}
        locale={jlensSiteConfig.defaultLocale}
        routePrefix={getProjectRoutePrefix(jlensSiteConfig)}
      >
        {children}
      </SiteShell>
    </div>
  );
}
