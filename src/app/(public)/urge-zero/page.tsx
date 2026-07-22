import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";

export const metadata = createUrgeZeroLandingMetadata(defaultLocale);

export default function UrgeZeroPage() {
  return <UrgeZeroLandingPage locale={defaultLocale} />;
}
import { defaultLocale } from "@/config/supported-locales";
