import { defaultLocale, supportedLocales } from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";

const currentYear = new Date().getFullYear();

export const subiqSiteConfig = definePublicSiteConfig({
  id: "subiq",
  internalBasePath: "/subiq",
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
