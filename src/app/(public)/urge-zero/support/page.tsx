import { defaultLocale } from "@/config/supported-locales";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";
import { UrgeZeroSupportPage } from "@/public-site/sites/urge-zero/support-page";
import { UrgeZeroStaticPageLayout } from "@/public-site/sites/urge-zero/static-page-layout";

export const metadata = createUrgeZeroStaticPageMetadata(
  "support",
  defaultLocale,
);

export default function SupportRoute() {
  return (
    <UrgeZeroStaticPageLayout
      locale={defaultLocale}
      activeNavigationHref="/support"
    >
      <UrgeZeroSupportPage locale={defaultLocale} />
    </UrgeZeroStaticPageLayout>
  );
}
