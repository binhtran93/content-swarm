import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";
import { SubiqSupportPage } from "@/public-site/sites/subiq/support-page";

export const metadata = createSubiqStaticPageMetadata("support", "en-US");
export default function SupportRoute() {
  return (
    <SubiqStaticPageLayout locale="en-US">
      <SubiqSupportPage />
    </SubiqStaticPageLayout>
  );
}
