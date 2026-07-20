import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  getLegalSiteIcons,
  LegalSiteShell,
} from "@/public-site/components/site";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

import "@/public-site/sites/urge-zero/theme.css";

export const metadata: Metadata = {
  icons: getLegalSiteIcons(urgeZeroSiteConfig),
};

export default function UrgeZeroLayout({ children }: { children: ReactNode }) {
  return (
    <LegalSiteShell config={urgeZeroSiteConfig}>{children}</LegalSiteShell>
  );
}
