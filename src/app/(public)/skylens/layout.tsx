import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  getLegalSiteIcons,
  LegalSiteShell,
} from "@/public-site/components/site";
import { skylensSiteConfig } from "@/public-site/sites/skylens/site-config";

import "@/public-site/sites/skylens/theme.css";

export const metadata: Metadata = {
  icons: getLegalSiteIcons(skylensSiteConfig),
};

export default function SkylensLayout({ children }: { children: ReactNode }) {
  return <LegalSiteShell config={skylensSiteConfig}>{children}</LegalSiteShell>;
}
