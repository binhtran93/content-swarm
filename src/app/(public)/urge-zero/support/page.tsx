import UrgeZeroSupportPage, {
  metadata as supportMetadata,
} from "@/public-site/sites/urge-zero/support-page";
import { UrgeZeroStaticPageLayout } from "@/public-site/sites/urge-zero/static-page-layout";

export const metadata = supportMetadata;

export default function SupportRoute() {
  return (
    <UrgeZeroStaticPageLayout activeNavigationHref="/support">
      <UrgeZeroSupportPage />
    </UrgeZeroStaticPageLayout>
  );
}
