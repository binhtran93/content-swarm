import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";
import { SubiqTermsPage } from "@/public-site/sites/subiq/terms-page";

export const metadata = createSubiqStaticPageMetadata("terms", "en-US");
export default function TermsRoute() {
  return (
    <SubiqStaticPageLayout locale="en-US">
      <SubiqTermsPage />
    </SubiqStaticPageLayout>
  );
}
