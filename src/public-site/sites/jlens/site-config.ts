import { defaultLocale } from "@/config/supported-locales";
import { definePublicSiteConfig } from "@/public-site/config/site-config";
import { publicProjectBasePaths } from "@/public-site/config/public-projects";

const currentYear = new Date().getFullYear();

export const jlensSiteConfig = definePublicSiteConfig({
  id: "jlens",
  internalBasePath: publicProjectBasePaths.jlens,
  canonicalOrigin: "https://jlensapp.com",
  analyticsMeasurementId: "G-R89Z9ZW09F",
  defaultLocale,
  locales: [defaultLocale],
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
