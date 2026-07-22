import type { ReactNode } from "react";

import { getPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import {
  getLocalizedUrgeZeroConfig,
  urgeZeroSiteConfig,
} from "@/public-site/sites/urge-zero/site-config";
import {
  getUrgeZeroMessages,
  urgeZeroStaticLocales,
  type UrgeZeroStaticLocale,
} from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";

function getPresentation(locale: UrgeZeroStaticLocale) {
  const messages = getUrgeZeroMessages(locale);
  return {
    waitlist: getLocalizedUrgeZeroConfig(locale).waitlist,
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
  urgeZeroStaticLocales.map((locale) => [locale, getPresentation(locale)]),
);

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
