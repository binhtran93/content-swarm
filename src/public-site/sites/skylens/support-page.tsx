import type { Metadata } from "next";

import { EnglishSupportPage } from "@/public-site/components/support";
import { skylensSiteConfig } from "@/public-site/sites/skylens/site-config";

export const metadata: Metadata = {
  title: "Support | SkyLens",
  description: "Contact SkyLens support and learn how to report an issue.",
};

export default function SkyLensSupportPage() {
  return (
    <EnglishSupportPage
      productName={skylensSiteConfig.name}
      companyName={skylensSiteConfig.copyrightName}
      supportEmail="support@anmisoft.com"
      privacyHref={`${skylensSiteConfig.basePath}/privacy`}
      termsHref={`${skylensSiteConfig.basePath}/terms`}
    />
  );
}
