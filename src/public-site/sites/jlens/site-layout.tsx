import {
  Bodoni_Moda,
  Noto_Naskh_Arabic,
  Noto_Serif_Devanagari,
  Noto_Serif_JP,
  Noto_Serif_KR,
  Noto_Serif_TC,
  Noto_Serif_Thai,
  Playfair_Display,
} from "next/font/google";
import type { ReactNode } from "react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { getLocalizedJlensConfig } from "@/public-site/sites/jlens/site-config";
import {
  getJlensTranslator,
  resolveJlensStaticLocale,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

import "./theme.css";

const bodoniDisplayFont = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-jlens-display-bodoni",
  weight: ["500", "600", "700"],
});

const vietnameseDisplayFont = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-jlens-display-vietnamese",
  weight: ["500", "600", "700"],
});

const arabicDisplayFont = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-jlens-display-arabic",
  weight: ["500", "600", "700"],
});

const devanagariDisplayFont = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-jlens-display-devanagari",
  weight: ["500", "600", "700"],
});

const thaiDisplayFont = Noto_Serif_Thai({
  subsets: ["thai"],
  variable: "--font-jlens-display-thai",
  weight: ["500", "600", "700"],
});

const japaneseDisplayFont = Noto_Serif_JP({
  preload: false,
  variable: "--font-jlens-display-japanese",
  weight: ["500", "600", "700"],
});

const koreanDisplayFont = Noto_Serif_KR({
  preload: false,
  variable: "--font-jlens-display-korean",
  weight: ["500", "600", "700"],
});

const traditionalChineseDisplayFont = Noto_Serif_TC({
  preload: false,
  variable: "--font-jlens-display-traditional-chinese",
  weight: ["500", "600", "700"],
});

const displayFontVariables = [
  bodoniDisplayFont.variable,
  vietnameseDisplayFont.variable,
  arabicDisplayFont.variable,
  devanagariDisplayFont.variable,
  thaiDisplayFont.variable,
  japaneseDisplayFont.variable,
  koreanDisplayFont.variable,
  traditionalChineseDisplayFont.variable,
].join(" ");

export function JlensSiteLayout({
  locale,
  activeNavigationHref,
  children,
}: {
  locale: SupportedLocaleCode;
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  const contentLocale = resolveJlensStaticLocale(locale);
  const config = getLocalizedJlensConfig(contentLocale);
  const t = getJlensTranslator(contentLocale);
  return (
    <div className={displayFontVariables}>
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
