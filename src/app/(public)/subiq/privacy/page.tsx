import { defaultLocale } from "@/config/supported-locales";
import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqPrivacyPage } from "@/public-site/sites/subiq/privacy-page";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";

export const metadata = createSubiqStaticPageMetadata("privacy", defaultLocale);
export default function PrivacyRoute() {
  return (
    <SubiqStaticPageLayout locale={defaultLocale}>
      <SubiqPrivacyPage />
    </SubiqStaticPageLayout>
  );
}
