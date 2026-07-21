import { EnglishSupportPage } from "@/public-site/components/support";
import { withPublicRoute } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";

export const metadata = createJlensStaticPageMetadata("support");

export default function JewelryIdentifierSupportPage() {
  const privacyHref = withPublicRoute(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    "/privacy",
  );
  const termsHref = withPublicRoute(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    "/terms",
  );

  return (
    <EnglishSupportPage
      productName={jlensSiteConfig.brand.name}
      companyName="ANMISOFT"
      supportEmail="support@anmisoft.com"
      privacyHref={privacyHref}
      termsHref={termsHref}
    />
  );
}
