import UrgeZeroTermsPage, {
  metadata as termsMetadata,
} from "@/public-site/sites/urge-zero/terms-page";
import { UrgeZeroStaticPageLayout } from "@/public-site/sites/urge-zero/static-page-layout";

export const metadata = termsMetadata;

export default function TermsRoute() {
  return (
    <UrgeZeroStaticPageLayout locale={defaultLocale}>
      <UrgeZeroTermsPage />
    </UrgeZeroStaticPageLayout>
  );
}
import { defaultLocale } from "@/config/supported-locales";
