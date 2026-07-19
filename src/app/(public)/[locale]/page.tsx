import { notFound } from "next/navigation";

import { requireSupportedLocale } from "@/config/supported-locales";
import { getPublicRouteMode } from "@/public-site/config/public-url";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";

type RouteProps = { params: Promise<{ locale: string }> };

function resolveRootLocale(value: string) {
  if (getPublicRouteMode() !== "root") notFound();
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === "en-US") notFound();
    return locale;
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: RouteProps) {
  return createSubiqLandingMetadata(resolveRootLocale((await params).locale));
}

export default async function RootLocalizedSubiqPage({ params }: RouteProps) {
  return <SubiqLandingPage locale={resolveRootLocale((await params).locale)} />;
}
