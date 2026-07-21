import JewelryIdentifierTermsPage, {
  metadata as termsMetadata,
} from "@/public-site/sites/jlens/terms-page";
import { JlensStaticPageLayout } from "@/public-site/sites/jlens/static-page-layout";

export const metadata = termsMetadata;

export default function TermsRoute() {
  return (
    <JlensStaticPageLayout>
      <JewelryIdentifierTermsPage />
    </JlensStaticPageLayout>
  );
}
