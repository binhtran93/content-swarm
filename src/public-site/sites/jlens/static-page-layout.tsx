import type { ReactNode } from "react";

import { JlensSiteLayout } from "@/public-site/sites/jlens/site-layout";

import "@/public-site/components/site/legal-document.css";

export function JlensStaticPageLayout({
  activeNavigationHref,
  children,
}: {
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <JlensSiteLayout activeNavigationHref={activeNavigationHref}>
      {children}
    </JlensSiteLayout>
  );
}
