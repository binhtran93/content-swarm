import UrgeZeroPrivacyPage, {
  metadata as privacyMetadata,
} from "@/public-site/sites/urge-zero/privacy-page";
import { UrgeZeroStaticPageLayout } from "@/public-site/sites/urge-zero/static-page-layout";

export const metadata = privacyMetadata;

export default function PrivacyRoute() {
  return (
    <UrgeZeroStaticPageLayout locale={defaultLocale}>
      <UrgeZeroPrivacyPage />
    </UrgeZeroStaticPageLayout>
  );
}
import { defaultLocale } from "@/config/supported-locales";
