import type { Metadata } from "next";

import { EnglishSupportPage } from "@/public-site/components/support";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const metadata: Metadata = {
  title: "Support | Urge Zero",
  description: "Contact Urge Zero support and learn how to report an issue.",
};

export default function UrgeZeroSupportPage() {
  return (
    <EnglishSupportPage
      productName={urgeZeroSiteConfig.name}
      companyName={urgeZeroSiteConfig.copyrightName}
      supportEmail="support@anmisoft.com"
      privacyHref={`${urgeZeroSiteConfig.basePath}/privacy`}
      termsHref={`${urgeZeroSiteConfig.basePath}/terms`}
    />
  );
}
