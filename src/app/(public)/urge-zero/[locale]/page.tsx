import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
  supportedLocales,
} from "@/config/supported-locales";
import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";

type Props = { params: Promise<{ locale: string }> };
function resolve(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === defaultLocale) notFound();
    return locale;
  } catch {
    notFound();
  }
}
export function generateStaticParams() {
  return supportedLocales
    .filter((item) => item.locale !== defaultLocale)
    .map((item) => ({ locale: item.locale }));
}
export async function generateMetadata({ params }: Props) {
  return createUrgeZeroLandingMetadata(resolve((await params).locale));
}
export default async function LocalizedUrgeZeroPage({ params }: Props) {
  return <UrgeZeroLandingPage locale={resolve((await params).locale)} />;
}
