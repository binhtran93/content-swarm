import { notFound } from "next/navigation";

import {
  requireSupportedLocale,
  supportedLocales,
} from "@/config/supported-locales";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";

type RouteProps = { params: Promise<{ locale: string }> };

function resolveLocale(value: string) {
  try {
    return requireSupportedLocale(value).locale;
  } catch {
    notFound();
  }
}

export function generateStaticParams() {
  return supportedLocales
    .filter((item) => item.locale !== "en-US")
    .map((item) => ({ locale: item.locale }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { locale } = await params;
  return createSubiqLandingMetadata(resolveLocale(locale));
}

export default async function LocalizedSubiqPage({ params }: RouteProps) {
  const { locale } = await params;
  return <SubiqLandingPage locale={resolveLocale(locale)} />;
}
