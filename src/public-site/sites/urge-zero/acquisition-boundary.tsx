import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

const presentations = {
  "en-US": {
    waitlist: urgeZeroSiteConfig.waitlist,
    availability: "UrgeZero app availability",
    submitting: "Joining…",
    done: "Done",
    close: "Close",
    notConfigured: "Download links are temporarily unavailable.",
    genericError: "We couldn’t complete that request. Please try again.",
    consent: "By joining, you agree to receive UrgeZero launch emails.",
    privacyPolicy: "Privacy Policy",
  },
} as const;

export async function UrgeZeroAcquisitionBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const acquisition = await getPublicProjectAcquisition(urgeZeroSiteConfig.id);

  return (
    <AcquisitionProvider
      acquisition={acquisition}
      brandName={urgeZeroSiteConfig.brand.name}
      defaultLocale={urgeZeroSiteConfig.defaultLocale}
      presentations={presentations}
      projectId={urgeZeroSiteConfig.id}
      scopeClassName={urgeZeroSiteConfig.scopeClassName}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
    >
      {children}
    </AcquisitionProvider>
  );
}
