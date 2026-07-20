import type { Metadata } from "next";

import { EnglishSupportPage } from "@/public-site/components/support";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export const metadata: Metadata = {
  title: "Support | JLens",
  description: "Contact JLens support and learn how to report an issue.",
};

export default function JewelryIdentifierSupportPage() {
  return (
    <EnglishSupportPage
      productName={jlensSiteConfig.name}
      companyName={jlensSiteConfig.copyrightName}
      supportEmail="support@anmisoft.com"
      privacyHref={`${jlensSiteConfig.basePath}/privacy`}
      termsHref={`${jlensSiteConfig.basePath}/terms`}
    />
  );
}
