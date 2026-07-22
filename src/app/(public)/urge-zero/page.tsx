import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";

export const metadata = createUrgeZeroLandingMetadata();

export default function UrgeZeroPage() {
  return <UrgeZeroLandingPage />;
}
