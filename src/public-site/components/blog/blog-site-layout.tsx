import type { ReactNode } from "react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { SiteShell } from "@/public-site/components/site";
import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { BlogNavigationProgress } from "./blog-navigation-progress";

export function BlogSiteLayout({
  config,
  routePrefix,
  locale,
  articleAlternates,
  children,
}: {
  config: PublicBlogConfig;
  routePrefix: string;
  locale: SupportedLocaleCode;
  articleAlternates?: Partial<Record<SupportedLocaleCode, string>>;
  children: ReactNode;
}) {
  return (
    <SiteShell
      config={config}
      routePrefix={routePrefix}
      activeNavigationHref="/blog"
      headerAccessory={<BlogNavigationProgress />}
      locale={locale}
      languageMenuLabel={
        config.accessibility?.changeLanguage ?? "Change language"
      }
      articleAlternates={articleAlternates}
    >
      {children}
    </SiteShell>
  );
}
