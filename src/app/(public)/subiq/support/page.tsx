import { defaultLocale } from "@/config/supported-locales";
import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";
import { SubiqSupportPage } from "@/public-site/sites/subiq/support-page";

export const metadata = createSubiqStaticPageMetadata("support", defaultLocale);
export default function SupportRoute() {
  return (
    <SubiqStaticPageLayout
      locale={defaultLocale}
      activeNavigationHref="/support"
    >
      <SubiqSupportPage locale={defaultLocale} />
    </SubiqStaticPageLayout>
  );
}
