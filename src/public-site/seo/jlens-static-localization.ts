import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import {
  isJlensStaticLocale,
  jlensStaticLocales,
} from "@/public-site/sites/jlens/i18n/get-jlens-translator";

export function getJlensStaticCanonicalLocale(
  locale: SupportedLocaleCode,
  localized: boolean,
) {
  return localized && isJlensStaticLocale(locale)
    ? locale
    : jlensSiteConfig.defaultLocale;
}

export function getJlensStaticLanguageAlternates(
  path: string,
  localized: boolean,
) {
  const locales = localized
    ? jlensStaticLocales
    : [jlensSiteConfig.defaultLocale];
  const defaultUrl = getCanonicalUrl(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    path,
  );

  return {
    ...Object.fromEntries(
      locales.map((locale) => [
        locale,
        getCanonicalUrl(jlensSiteConfig, locale, path),
      ]),
    ),
    "x-default": defaultUrl,
  };
}
