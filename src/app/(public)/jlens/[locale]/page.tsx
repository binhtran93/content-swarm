import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
  supportedLocales,
} from "@/config/supported-locales";
import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { JlensLandingPage } from "@/public-site/sites/jlens/landing-page";

type RouteProps = { params: Promise<{ locale: string }> };

function resolveLocale(value: string) {
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

export async function generateMetadata({ params }: RouteProps) {
  return createJlensLandingMetadata(resolveLocale((await params).locale));
}

export default async function LocalizedJlensPage({ params }: RouteProps) {
  return <JlensLandingPage locale={resolveLocale((await params).locale)} />;
}
