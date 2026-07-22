import { EnglishSupportPage } from "@/public-site/components/support";
import { withPublicRoute } from "@/public-site/config/public-url";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";

export const metadata = createUrgeZeroStaticPageMetadata("support");

export default function UrgeZeroSupportPage() {
  const privacyHref = withPublicRoute(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    "/privacy",
  );
  const termsHref = withPublicRoute(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    "/terms",
  );

  return (
    <EnglishSupportPage
      productName={urgeZeroSiteConfig.brand.name}
      companyName="ANMISOFT"
      supportEmail="support@anmisoft.com"
      privacyHref={privacyHref}
      termsHref={termsHref}
    />
  );
}
