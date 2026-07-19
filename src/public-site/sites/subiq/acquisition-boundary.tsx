import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export async function SubiqAcquisitionBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const acquisition = await getPublicProjectAcquisition(subiqSiteConfig.id);
  return (
    <AcquisitionProvider
      acquisition={acquisition}
      brandName={subiqSiteConfig.brand.name}
      projectId={subiqSiteConfig.id}
      scopeClassName={subiqSiteConfig.scopeClassName}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
      waitlist={subiqSiteConfig.waitlist}
    >
      {children}
    </AcquisitionProvider>
  );
}
