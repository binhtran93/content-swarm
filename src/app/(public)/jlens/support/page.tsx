import JewelryIdentifierSupportPage, {
  metadata as supportMetadata,
} from "@/public-site/sites/jlens/support-page";
import { JlensStaticPageLayout } from "@/public-site/sites/jlens/static-page-layout";

export const metadata = supportMetadata;

export default function SupportRoute() {
  return (
    <JlensStaticPageLayout activeNavigationHref="/support">
      <JewelryIdentifierSupportPage />
    </JlensStaticPageLayout>
  );
}
