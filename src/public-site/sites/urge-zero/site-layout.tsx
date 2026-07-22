import { Bebas_Neue, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

import "./theme.css";

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-urge-zero-display",
  weight: "400",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-urge-zero-body",
});

export function UrgeZeroSiteLayout({
  activeNavigationHref,
  children,
}: {
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${bodyFont.variable} ${displayFont.variable}`}>
      <SiteShell
        activeNavigationHref={activeNavigationHref}
        config={urgeZeroSiteConfig}
        locale={urgeZeroSiteConfig.defaultLocale}
        routePrefix={getProjectRoutePrefix(urgeZeroSiteConfig)}
      >
        {children}
      </SiteShell>
    </div>
  );
}
