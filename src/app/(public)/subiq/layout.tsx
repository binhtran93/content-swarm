import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export const metadata: Metadata = {
  icons: getPublicSiteIcons(subiqSiteConfig),
};

export default function SubiqRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
