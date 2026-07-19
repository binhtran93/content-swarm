import { defaultLocale } from "@/config/supported-locales";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";

export const metadata = createSubiqLandingMetadata(defaultLocale);

export default function SubiqPage() {
  return <SubiqLandingPage locale={defaultLocale} />;
}
