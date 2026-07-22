import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import {
  getLocalizedJlensConfig,
  jlensSiteConfig,
} from "@/public-site/sites/jlens/site-config";
import {
  getJlensMessages,
  jlensStaticLocales,
  type JlensStaticLocale,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

function getPresentation(locale: JlensStaticLocale) {
  const messages = getJlensMessages(locale);
  return {
    waitlist: getLocalizedJlensConfig(locale).waitlist,
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
  jlensStaticLocales.map((locale) => [locale, getPresentation(locale)]),
);

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
