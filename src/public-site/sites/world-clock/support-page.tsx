import type { Metadata } from "next";

import { EnglishSupportPage } from "@/public-site/components/support";
import { worldClockSiteConfig } from "@/public-site/sites/world-clock/site-config";

export const metadata: Metadata = {
  title: "Support | World Clock Plus",
  description:
    "Contact World Clock Plus support for product help, privacy requests, and account assistance.",
};

export default function WorldClockSupportPage() {
  return (
    <EnglishSupportPage
      productName={worldClockSiteConfig.name}
      companyName={worldClockSiteConfig.copyrightName}
      supportEmail="support@anmisoft.com"
      privacyHref={`${worldClockSiteConfig.basePath}/privacy`}
      termsHref={`${worldClockSiteConfig.basePath}/terms`}
    />
  );
}
