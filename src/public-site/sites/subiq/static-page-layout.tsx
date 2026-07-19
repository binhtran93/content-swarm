import type { ReactNode } from "react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

import "./theme.css";

export function SubiqStaticPageLayout({
  locale,
  children,
}: {
  locale: SupportedLocaleCode;
  children: ReactNode;
}) {
  return (
    <SiteShell
      config={subiqSiteConfig}
      routePrefix={getProjectRoutePrefix(subiqSiteConfig)}
      locale={locale}
      languageMenuLabel="Change language"
    >
      {children}
    </SiteShell>
  );
}
