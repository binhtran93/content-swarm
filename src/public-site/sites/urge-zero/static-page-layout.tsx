import type { ReactNode } from "react";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { getUrgeZeroTranslator } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { UrgeZeroSiteLayout } from "@/public-site/sites/urge-zero/site-layout";

import "@/public-site/components/site/legal-document.css";

export function UrgeZeroStaticPageLayout({
  locale,
  activeNavigationHref,
  children,
}: {
  locale: SupportedLocaleCode;
  activeNavigationHref?: string;
  children: ReactNode;
}) {
  return (
    <UrgeZeroSiteLayout
      locale={locale}
      activeNavigationHref={activeNavigationHref}
    >
      {children}
    </UrgeZeroSiteLayout>
  );
}

export function UrgeZeroEnglishLegalNotice({
  locale,
}: {
  locale: SupportedLocaleCode;
}) {
  if (locale === defaultLocale) return null;
  const t = getUrgeZeroTranslator(locale);
  return (
    <aside
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
      role="note"
    >
      {t("site.legalEnglishNotice")}
    </aside>
  );
}
