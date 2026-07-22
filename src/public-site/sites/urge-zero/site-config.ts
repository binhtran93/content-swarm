import { defaultLocale } from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

const currentYear = new Date().getFullYear();

export const urgeZeroSiteConfig = definePublicSiteConfig({
  id: "urge-zero",
  internalBasePath: publicProjectBasePaths["urge-zero"],
  canonicalOrigin: "https://urgezero.com",
  analyticsMeasurementId: "G-5FLBTTBYY1",
  defaultLocale,
  locales: [defaultLocale],
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
