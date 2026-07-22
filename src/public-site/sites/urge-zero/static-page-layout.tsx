import type { ReactNode } from "react";

import { UrgeZeroSiteLayout } from "@/public-site/sites/urge-zero/site-layout";

import "@/public-site/components/site/legal-document.css";

export function UrgeZeroStaticPageLayout({
  activeNavigationHref,
  children,
}: {
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <UrgeZeroSiteLayout activeNavigationHref={activeNavigationHref}>
      {children}
    </UrgeZeroSiteLayout>
  );
}
