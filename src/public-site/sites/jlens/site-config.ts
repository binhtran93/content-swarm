import {
  defaultLocale,
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";
import {
  getJlensMessages,
  jlensStaticLocales,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

const currentYear = new Date().getFullYear();

export const jlensSiteConfig = definePublicSiteConfig({
  id: "jlens",
  internalBasePath: publicProjectBasePaths.jlens,
  canonicalOrigin: "https://jlensapp.com",
  analyticsMeasurementId: "G-R89Z9ZW09F",
  defaultLocale,
  locales: supportedLocales.map((item) => item.locale),
  scopeClassName: "jlens-site",
  theme: {
    routeProgressColor: "#8a6724",
  },
  accessibility: {
    changeLanguage: "Change language",
    primaryNavigation: "Primary navigation",
    legalNavigation: "Legal and support",
    brandHome: "JLens home",
    backToTop: "Back to the top",
  },
  brand: {
    name: "JLens",
    wordmarkLead: "J",
    wordmarkAccent: "Lens",
    logoSrc: "/jlens/logo.png",
    logoAlt: "JLens",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Support", href: "/support" },
  ],
  headerCta: { kind: "acquisition", label: "Download" },
  waitlist: {
    ctaLabel: "Get launch updates",
    title: "Get JLens launch updates",
    description: "We’ll email you when JLens is available in your region.",
    successDescription: "We’ll let you know when JLens is available.",
  },
  footer: {
    links: [
      { href: "/support", label: "Support" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
    copyright: `© ${currentYear} ANMISOFT — All rights reserved`,
    disclaimer:
      "AI-assisted estimates are informational and do not replace professional appraisal or authentication.",
  },
  storeBadges: [
    {
      platform: "appStore",
      label: "Download JLens on the App Store",
      imageSrc: "/jlens/app-store.svg",
      width: 134,
      height: 40,
    },
    {
      platform: "googlePlay",
      label: "Get JLens on Google Play",
      imageSrc: "/jlens/google-play.svg",
      width: 180,
      height: 54,
    },
  ],
});

export function getLocalizedJlensConfig(locale: SupportedLocaleCode) {
  const messages = getJlensMessages(locale);
  return {
    ...jlensSiteConfig,
    locales: jlensStaticLocales,
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
      ...jlensSiteConfig.footer,
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
    storeBadges: jlensSiteConfig.storeBadges.map((badge) => ({
      ...badge,
      label:
        badge.platform === "appStore"
          ? messages.acquisition.appStore
          : messages.acquisition.googlePlay,
    })),
  } satisfies typeof jlensSiteConfig;
}
