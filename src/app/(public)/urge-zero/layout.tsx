import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { UrgeZeroAcquisitionBoundary } from "@/public-site/sites/urge-zero/acquisition-boundary";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(urgeZeroSiteConfig.canonicalOrigin),
  icons: getPublicSiteIcons(urgeZeroSiteConfig),
};

export default function UrgeZeroLayout({ children }: { children: ReactNode }) {
  return <UrgeZeroAcquisitionBoundary>{children}</UrgeZeroAcquisitionBoundary>;
}
