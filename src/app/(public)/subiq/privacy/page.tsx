import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqPrivacyPage } from "@/public-site/sites/subiq/privacy-page";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";

export const metadata = createSubiqStaticPageMetadata("privacy", "en-US");
export default function PrivacyRoute() {
  return (
    <SubiqStaticPageLayout locale="en-US">
      <SubiqPrivacyPage />
    </SubiqStaticPageLayout>
  );
}
