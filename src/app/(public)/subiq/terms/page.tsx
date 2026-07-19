import { defaultLocale } from "@/config/supported-locales";
import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";
import { SubiqTermsPage } from "@/public-site/sites/subiq/terms-page";

export const metadata = createSubiqStaticPageMetadata("terms", defaultLocale);
export default function TermsRoute() {
  return (
    <SubiqStaticPageLayout locale={defaultLocale}>
      <SubiqTermsPage />
    </SubiqStaticPageLayout>
  );
}
