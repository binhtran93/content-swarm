import {
  defaultLocale,
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";
import {
  getSubiqMessages,
  subiqStaticLocales,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

const currentYear = new Date().getFullYear();

export const subiqSiteConfig = definePublicSiteConfig({
  id: "subiq",
  internalBasePath: publicProjectBasePaths.subiq,
  canonicalOrigin: "https://getsubiq.com",
  defaultLocale,
  locales: supportedLocales.map((item) => item.locale),
  scopeClassName: "subiq-site",
  theme: {
    routeProgressColor: "#2e7d32",
  },
  brand: {
    name: "SubIQ",
    wordmarkLead: "Sub",
    wordmarkAccent: "IQ",
    logoSrc: "/subiq/mascot-hi.webp",
    logoAlt: "SubIQ",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Support", href: "/support" },
  ],
  headerCta: { label: "Download", href: "/#download" },
  footer: {
    links: [
      { href: "/support", label: "Support" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
    copyright: `© ${currentYear} ANMISOFT — All rights reserved`,
    disclaimer:
      "Illustrative prices — Third-party trademarks belong to their owners",
  },
  storeBadges: [
    {
      platform: "appStore",
      label: "Download on the App Store",
      imageSrc: "/subiq/app-store.svg",
      width: 134,
      height: 40,
    },
    {
      platform: "googlePlay",
      label: "Get it on Google Play",
      imageSrc: "/subiq/google-play.svg",
      width: 180,
      height: 54,
    },
  ],
});

export function getLocalizedSubiqConfig(locale: SupportedLocaleCode) {
  const messages = getSubiqMessages(locale);
  return {
    ...subiqSiteConfig,
    locales: subiqStaticLocales,
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
    headerCta: { label: messages.site.download, href: "/#download" },
    footer: {
      ...subiqSiteConfig.footer,
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
    storeBadges: subiqSiteConfig.storeBadges.map((badge) => ({
      ...badge,
      label:
        badge.platform === "appStore"
          ? messages.acquisition.appStore
          : messages.acquisition.googlePlay,
    })),
  } satisfies typeof subiqSiteConfig;
}
