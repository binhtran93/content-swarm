import type { SupportedLocaleCode } from "@/config/supported-locales";

export type SiteNavigationItem = {
  label: string;
  href: string;
};

export type SiteHeaderCta =
  | ({ kind: "link" } & SiteNavigationItem)
  | {
      kind: "acquisition";
      label: string;
    };

export type SiteStoreBadge = {
  platform: "appStore" | "googlePlay";
  label: string;
  imageSrc: string;
  width: number;
  height: number;
};

export type SiteWaitlistPresentation = {
  ctaLabel: string;
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
};

export type PublicSiteConfig = {
  id: string;
  internalBasePath: string;
  canonicalOrigin: string;
  analyticsMeasurementId?: string;
  defaultLocale: SupportedLocaleCode;
  locales: readonly SupportedLocaleCode[];
  scopeClassName: string;
  theme: {
    routeProgressColor: string;
  };
  accessibility?: {
    changeLanguage: string;
    primaryNavigation: string;
    legalNavigation: string;
    brandHome: string;
    backToTop: string;
  };
  brand: {
    name: string;
    wordmarkLead: string;
    wordmarkAccent?: string;
    logoSrc: string;
    logoAlt: string;
    faviconFilename?: string;
  };
  navigation: readonly SiteNavigationItem[];
  headerCta: SiteHeaderCta;
  waitlist: SiteWaitlistPresentation;
  footer: {
    links: readonly SiteNavigationItem[];
    copyright: string;
    disclaimer?: string;
  };
  storeBadges: readonly SiteStoreBadge[];
};

export type PublicSiteConfigInput = Omit<PublicSiteConfig, "waitlist"> & {
  waitlist?: Partial<SiteWaitlistPresentation>;
};

export function createDefaultWaitlistPresentation(
  brandName: string,
): SiteWaitlistPresentation {
  return {
    ctaLabel: "Join waitlist",
    title: `Join the ${brandName} waitlist`,
    description: `Get an email when ${brandName} is available`,
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    submitLabel: "Join waitlist",
    successTitle: "You’re on the list",
    successDescription: `We’ll let you know when ${brandName} launches`,
  };
}

export function definePublicSiteConfig(
  input: PublicSiteConfigInput,
): PublicSiteConfig {
  if (
    input.analyticsMeasurementId !== undefined &&
    !/^G-[A-Z0-9]+$/i.test(input.analyticsMeasurementId)
  ) {
    throw new Error("Invalid Google Analytics measurement ID");
  }

  return {
    ...input,
    waitlist: {
      ...createDefaultWaitlistPresentation(input.brand.name),
      ...input.waitlist,
    },
  };
}
