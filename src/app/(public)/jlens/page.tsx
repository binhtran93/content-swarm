import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { JlensLandingPage } from "@/public-site/sites/jlens/landing-page";

export const metadata = createJlensLandingMetadata();

export default function JlensPage() {
  return <JlensLandingPage />;
}
