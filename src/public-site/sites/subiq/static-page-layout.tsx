import type { ReactNode } from "react";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { SiteShell } from "@/public-site/components/site";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { getLocalizedSubiqConfig } from "@/public-site/sites/subiq/site-config";
import {
  getSubiqTranslator,
  resolveSubiqStaticLocale,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

import "./theme.css";

export function SubiqStaticPageLayout({
  locale,
  children,
}: {
  locale: SupportedLocaleCode;
  children: ReactNode;
}) {
  const contentLocale = resolveSubiqStaticLocale(locale);
  const config = getLocalizedSubiqConfig(contentLocale);
  const t = getSubiqTranslator(contentLocale);
  return (
    <SiteShell
      config={config}
      routePrefix={getProjectRoutePrefix(config)}
      locale={contentLocale}
      languageMenuLabel={t("site.changeLanguage")}
    >
      {children}
    </SiteShell>
  );
}

export function EnglishLegalNotice({
  locale,
}: {
  locale: SupportedLocaleCode;
}) {
  if (locale === defaultLocale) return null;
  const t = getSubiqTranslator(locale);
  return (
    <aside
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
      role="note"
    >
      {t("site.legalEnglishNotice")}
    </aside>
  );
}
