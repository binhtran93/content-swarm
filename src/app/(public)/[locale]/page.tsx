import { notFound } from "next/navigation";

import { requireSupportedLocale } from "@/config/supported-locales";
import {
  getDedicatedPublicProjectId,
  getPublicRouteMode,
} from "@/public-site/config/public-url";
import { JlensAcquisitionBoundary } from "@/public-site/sites/jlens/acquisition-boundary";
import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { JlensLandingPage } from "@/public-site/sites/jlens/landing-page";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqAcquisitionBoundary } from "@/public-site/sites/subiq/acquisition-boundary";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";
import { UrgeZeroAcquisitionBoundary } from "@/public-site/sites/urge-zero/acquisition-boundary";
import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";

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
  const locale = resolveRootLocale((await params).locale);
  switch (getDedicatedPublicProjectId()) {
    case "jlens":
      return createJlensLandingMetadata(locale);
    case "subiq":
      return createSubiqLandingMetadata(locale);
    case "urge-zero":
      return createUrgeZeroLandingMetadata(locale);
    default:
      notFound();
  }
}

export default async function RootLocalizedSubiqPage({ params }: RouteProps) {
  const locale = resolveRootLocale((await params).locale);
  switch (getDedicatedPublicProjectId()) {
    case "jlens":
      return (
        <JlensAcquisitionBoundary>
          <JlensLandingPage locale={locale} />
        </JlensAcquisitionBoundary>
      );
    case "subiq":
      return (
        <SubiqAcquisitionBoundary>
          <SubiqLandingPage locale={locale} />
        </SubiqAcquisitionBoundary>
      );
    case "urge-zero":
      return (
        <UrgeZeroAcquisitionBoundary>
          <UrgeZeroLandingPage locale={locale} />
        </UrgeZeroAcquisitionBoundary>
      );
    default:
      notFound();
  }
}
