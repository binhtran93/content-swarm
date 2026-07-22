import { defaultLocale } from "@/config/supported-locales";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";
import { JlensStaticPageLayout } from "@/public-site/sites/jlens/static-page-layout";
import { JlensSupportPage } from "@/public-site/sites/jlens/support-page";

export const metadata = createJlensStaticPageMetadata("support", defaultLocale);

export default function SupportRoute() {
  return (
    <JlensStaticPageLayout
      locale={defaultLocale}
      activeNavigationHref="/support"
    >
      <JlensSupportPage locale={defaultLocale} />
    </JlensStaticPageLayout>
  );
}
