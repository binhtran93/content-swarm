import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getCanonicalUrl } from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import {
  isSubiqStaticLocale,
  subiqStaticLocales,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";

export function getSubiqStaticCanonicalLocale(
  locale: SupportedLocaleCode,
  localized: boolean,
) {
  return localized && isSubiqStaticLocale(locale)
    ? locale
    : subiqSiteConfig.defaultLocale;
}

export function getSubiqStaticLanguageAlternates(
  path: string,
  localized: boolean,
) {
  const locales = localized
    ? subiqStaticLocales
    : [subiqSiteConfig.defaultLocale];
  const defaultUrl = getCanonicalUrl(
    subiqSiteConfig,
    subiqSiteConfig.defaultLocale,
    path,
  );

  return {
    ...Object.fromEntries(
      locales.map((locale) => [
        locale,
        getCanonicalUrl(subiqSiteConfig, locale, path),
      ]),
    ),
    "x-default": defaultUrl,
  };
}
