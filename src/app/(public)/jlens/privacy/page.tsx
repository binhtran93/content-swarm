import JewelryIdentifierPrivacyPage, {
  metadata as privacyMetadata,
} from "@/public-site/sites/jlens/privacy-page";
import { JlensStaticPageLayout } from "@/public-site/sites/jlens/static-page-layout";

export const metadata = privacyMetadata;

export default function PrivacyRoute() {
  return (
    <JlensStaticPageLayout>
      <JewelryIdentifierPrivacyPage />
    </JlensStaticPageLayout>
  );
}
