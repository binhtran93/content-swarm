import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import {
  getLocalizedSubiqConfig,
  subiqSiteConfig,
} from "@/public-site/sites/subiq/site-config";
import {
  getSubiqMessages,
  subiqStaticLocales,
  type SubiqStaticLocale,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

function getPresentation(locale: SubiqStaticLocale) {
  const messages = getSubiqMessages(locale);
  return {
    waitlist: getLocalizedSubiqConfig(locale).waitlist,
    availability: messages.acquisition.availability,
    submitting: messages.acquisition.submitting,
    done: messages.acquisition.done,
    close: messages.acquisition.close,
    notConfigured: messages.acquisition.notConfigured,
    genericError: messages.acquisition.genericError,
    consent: messages.acquisition.consent,
    privacyPolicy: messages.acquisition.privacyPolicy,
  };
}

const presentations = Object.fromEntries(
  subiqStaticLocales.map((locale) => [locale, getPresentation(locale)]),
);

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
      defaultLocale={subiqSiteConfig.defaultLocale}
      projectId={subiqSiteConfig.id}
      scopeClassName={subiqSiteConfig.scopeClassName}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
      presentations={presentations}
    >
      {children}
    </AcquisitionProvider>
  );
}
