import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

const presentations = {
  "en-US": {
    waitlist: jlensSiteConfig.waitlist,
    availability: "JLens app availability",
    submitting: "Joining…",
    done: "Done",
    close: "Close",
    notConfigured: "Email signup is temporarily unavailable.",
    genericError: "We couldn’t complete that request. Please try again.",
    consent: "By joining, you agree to receive JLens launch emails.",
    privacyPolicy: "Privacy Policy",
  },
} as const;

export async function JlensAcquisitionBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const acquisition = await getPublicProjectAcquisition(jlensSiteConfig.id);

  return (
    <AcquisitionProvider
      acquisition={acquisition}
      brandName={jlensSiteConfig.brand.name}
      defaultLocale={jlensSiteConfig.defaultLocale}
      presentations={presentations}
      projectId={jlensSiteConfig.id}
      scopeClassName={jlensSiteConfig.scopeClassName}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
    >
      {children}
    </AcquisitionProvider>
  );
}
