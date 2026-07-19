import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";

export const metadata = createSubiqLandingMetadata("en-US");

export default function SubiqPage() {
  return <SubiqLandingPage locale="en-US" />;
}
