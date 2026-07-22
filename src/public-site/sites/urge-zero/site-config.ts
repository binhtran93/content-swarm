import {
  defaultLocale,
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";
import {
  getUrgeZeroMessages,
  urgeZeroStaticLocales,
} from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";

const currentYear = new Date().getFullYear();

export const urgeZeroSiteConfig = definePublicSiteConfig({
  id: "urge-zero",
  internalBasePath: publicProjectBasePaths["urge-zero"],
  canonicalOrigin: "https://urgezero.com",
  analyticsMeasurementId: "G-5FLBTTBYY1",
  defaultLocale,
  locales: supportedLocales.map((item) => item.locale),
  scopeClassName: "urge-zero-site",
  theme: {
    routeProgressColor: "#BE9050",
  },
  accessibility: {
    changeLanguage: "Change language",
    primaryNavigation: "Primary navigation",
    legalNavigation: "Legal and support",
    brandHome: "UrgeZero home",
    backToTop: "Back to the top",
  },
  brand: {
    name: "UrgeZero",
    wordmarkLead: "Urge",
    wordmarkAccent: "Zero",
    logoSrc: "/urge-zero/logo.png",
    logoAlt: "UrgeZero",
    faviconFilename: "logo.png",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Support", href: "/support" },
  ],
  headerCta: { kind: "acquisition", label: "Download" },
  footer: {
    links: [
      { href: "/support", label: "Support" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
    copyright: `© ${currentYear} ANMISOFT — All rights reserved`,
    disclaimer:
      "UrgeZero is for self-improvement and education. It does not provide medical advice, diagnosis, or treatment.",
  },
  storeBadges: [
    {
      platform: "appStore",
      label: "Download UrgeZero on the App Store",
      imageSrc: "/urge-zero/app-store.svg",
      width: 134,
      height: 40,
    },
    {
      platform: "googlePlay",
      label: "Get UrgeZero on Google Play",
      imageSrc: "/urge-zero/google-play.svg",
      width: 180,
      height: 54,
    },
  ],
});

export function getLocalizedUrgeZeroConfig(locale: SupportedLocaleCode) {
  const messages = getUrgeZeroMessages(locale);
  return {
    ...urgeZeroSiteConfig,
    locales: urgeZeroStaticLocales,
    accessibility: {
      changeLanguage: messages.site.changeLanguage,
      primaryNavigation: messages.site.primaryNavigation,
      legalNavigation: messages.site.legalNavigation,
      brandHome: messages.site.brandHome,
      backToTop: messages.site.backToTop,
    },
    navigation: [
      { label: messages.site.home, href: "/" },
      { label: messages.site.blog, href: "/blog" },
      { label: messages.site.faq, href: "/#faq" },
      { label: messages.site.support, href: "/support" },
    ],
    headerCta: { kind: "acquisition", label: messages.site.download },
    footer: {
      ...urgeZeroSiteConfig.footer,
      links: [
        { href: "/support", label: messages.site.support },
        { href: "/privacy", label: messages.site.privacy },
        { href: "/terms", label: messages.site.terms },
      ],
      disclaimer: messages.site.disclaimer,
    },
    waitlist: {
      ctaLabel: messages.acquisition.cta,
      title: messages.acquisition.title,
      description: messages.acquisition.description,
      emailLabel: messages.acquisition.emailLabel,
      emailPlaceholder: messages.acquisition.emailPlaceholder,
      submitLabel: messages.acquisition.submit,
      successTitle: messages.acquisition.successTitle,
      successDescription: messages.acquisition.successDescription,
    },
    storeBadges: urgeZeroSiteConfig.storeBadges.map((badge) => ({
      ...badge,
      label:
        badge.platform === "appStore"
          ? messages.acquisition.appStore
          : messages.acquisition.googlePlay,
    })),
  } satisfies typeof urgeZeroSiteConfig;
}
