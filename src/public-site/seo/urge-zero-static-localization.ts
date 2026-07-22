import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import {
  isUrgeZeroStaticLocale,
  urgeZeroStaticLocales,
} from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export function getUrgeZeroStaticCanonicalLocale(
  locale: SupportedLocaleCode,
  localized: boolean,
) {
  return localized && isUrgeZeroStaticLocale(locale)
    ? locale
    : urgeZeroSiteConfig.defaultLocale;
}

export function getUrgeZeroStaticLanguageAlternates(
  path: string,
  localized: boolean,
) {
  const locales = localized
    ? urgeZeroStaticLocales
    : [urgeZeroSiteConfig.defaultLocale];
  const defaultUrl = getCanonicalUrl(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    path,
  );
  return {
    ...Object.fromEntries(
      locales.map((locale) => [
        locale,
        getCanonicalUrl(urgeZeroSiteConfig, locale, path),
      ]),
    ),
    "x-default": defaultUrl,
  };
}
