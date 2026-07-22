import Link from "next/link";

import { defaultLocale } from "@/config/supported-locales";
import {
  getDedicatedPublicProjectId,
  getPublicRouteMode,
} from "@/public-site/config/public-url";
import { JlensAcquisitionBoundary } from "@/public-site/sites/jlens/acquisition-boundary";
import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { JlensLandingPage } from "@/public-site/sites/jlens/landing-page";
import { SubiqAcquisitionBoundary } from "@/public-site/sites/subiq/acquisition-boundary";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { SubiqLandingPage } from "@/public-site/sites/subiq/landing-page";
import { UrgeZeroAcquisitionBoundary } from "@/public-site/sites/urge-zero/acquisition-boundary";
import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";

function assertNever(value: never): never {
  throw new Error(`Unsupported dedicated public project: ${value}`);
}

export function generateMetadata() {
  if (getPublicRouteMode() !== "root") return undefined;

  const projectId = getDedicatedPublicProjectId();
  switch (projectId) {
    case "jlens":
      return createJlensLandingMetadata(defaultLocale);
    case "subiq":
      return createSubiqLandingMetadata("en-US");
    case "urge-zero":
      return createUrgeZeroLandingMetadata();
    default:
      return assertNever(projectId);
  }
}

export default function HomePage() {
  if (getPublicRouteMode() === "root") {
    const projectId = getDedicatedPublicProjectId();
    switch (projectId) {
      case "jlens":
        return (
          <JlensAcquisitionBoundary>
            <JlensLandingPage locale={defaultLocale} />
          </JlensAcquisitionBoundary>
        );
      case "subiq":
        return (
          <SubiqAcquisitionBoundary>
            <SubiqLandingPage locale="en-US" />
          </SubiqAcquisitionBoundary>
        );
      case "urge-zero":
        return (
          <UrgeZeroAcquisitionBoundary>
            <UrgeZeroLandingPage />
          </UrgeZeroAcquisitionBoundary>
        );
      default:
        return assertNever(projectId);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-xl text-center">
        <p className="text-primary mb-3 text-sm font-semibold tracking-[0.2em]">
          ANMISOFT
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Content platform foundation
        </h1>
        <p className="text-base-content/65 mt-4 leading-7">
          The public experience is being rebuilt around independent products and
          one maintainable publishing platform.
        </p>
        <Link className="btn btn-primary mt-8" href="/login">
          Owner sign in
        </Link>
      </section>
    </main>
  );
}
