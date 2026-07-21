import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { JlensAcquisitionBoundary } from "@/public-site/sites/jlens/acquisition-boundary";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export const metadata: Metadata = {
  icons: getPublicSiteIcons(jlensSiteConfig),
};

export default function JlensLayout({ children }: { children: ReactNode }) {
  return <JlensAcquisitionBoundary>{children}</JlensAcquisitionBoundary>;
}
