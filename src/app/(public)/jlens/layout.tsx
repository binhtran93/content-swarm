import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  getLegalSiteIcons,
  LegalSiteShell,
} from "@/public-site/components/site";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

import "@/public-site/sites/jlens/theme.css";

export const metadata: Metadata = {
  icons: getLegalSiteIcons(jlensSiteConfig),
};

export default function JlensLayout({ children }: { children: ReactNode }) {
  return <LegalSiteShell config={jlensSiteConfig}>{children}</LegalSiteShell>;
}
