import type { ReactNode } from "react";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { JlensSiteLayout } from "@/public-site/sites/jlens/site-layout";
import { getJlensTranslator } from "@/public-site/sites/jlens/i18n/get-jlens-translator";

import "@/public-site/components/site/legal-document.css";

export function JlensStaticPageLayout({
  locale,
  activeNavigationHref,
  children,
}: {
  locale: SupportedLocaleCode;
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <JlensSiteLayout
      locale={locale}
      activeNavigationHref={activeNavigationHref}
    >
      {children}
    </JlensSiteLayout>
  );
}

export function JlensEnglishLegalNotice({
  locale,
}: {
  locale: SupportedLocaleCode;
}) {
  if (locale === defaultLocale) return null;
  const t = getJlensTranslator(locale);
  return (
    <aside
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
      role="note"
    >
      {t("site.legalEnglishNotice")}
    </aside>
  );
}
