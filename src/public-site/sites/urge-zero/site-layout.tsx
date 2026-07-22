import {
  Bebas_Neue,
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_TC,
  Noto_Sans_Thai,
  Oswald,
} from "next/font/google";
import type { ReactNode } from "react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import {
  getUrgeZeroTranslator,
  resolveUrgeZeroStaticLocale,
} from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { getLocalizedUrgeZeroConfig } from "@/public-site/sites/urge-zero/site-config";

import "./theme.css";

const latinDisplay = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-urge-zero-display-latin",
  weight: "400",
});
const vietnameseDisplay = Oswald({
  subsets: ["vietnamese"],
  variable: "--font-urge-zero-display-vietnamese",
  weight: ["400", "500", "600"],
});
const latinBody = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-urge-zero-body-latin",
});
const arabicFont = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-urge-zero-arabic",
  weight: ["400", "500", "600", "700"],
});
const devanagariFont = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-urge-zero-devanagari",
  weight: ["400", "500", "600", "700"],
});
const thaiFont = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-urge-zero-thai",
  weight: ["400", "500", "600", "700"],
});
const japaneseFont = Noto_Sans_JP({
  preload: false,
  variable: "--font-urge-zero-japanese",
  weight: ["400", "500", "600", "700"],
});
const koreanFont = Noto_Sans_KR({
  preload: false,
  variable: "--font-urge-zero-korean",
  weight: ["400", "500", "600", "700"],
});
const traditionalChineseFont = Noto_Sans_TC({
  preload: false,
  variable: "--font-urge-zero-traditional-chinese",
  weight: ["400", "500", "600", "700"],
});

export const urgeZeroFontVariables = [
  latinDisplay.variable,
  vietnameseDisplay.variable,
  latinBody.variable,
  arabicFont.variable,
  devanagariFont.variable,
  thaiFont.variable,
  japaneseFont.variable,
  koreanFont.variable,
  traditionalChineseFont.variable,
].join(" ");

export function UrgeZeroSiteLayout({
  locale,
  activeNavigationHref,
  children,
}: {
  locale: SupportedLocaleCode;
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  const contentLocale = resolveUrgeZeroStaticLocale(locale);
  const config = getLocalizedUrgeZeroConfig(contentLocale);
  const t = getUrgeZeroTranslator(contentLocale);
  return (
    <div className={urgeZeroFontVariables}>
      <SiteShell
        activeNavigationHref={activeNavigationHref}
        config={config}
        locale={contentLocale}
        routePrefix={getProjectRoutePrefix(config)}
        languageMenuLabel={t("site.changeLanguage")}
      >
        {children}
      </SiteShell>
    </div>
  );
}
