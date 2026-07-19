import { z } from "zod";

export type SupportedLocale = {
  locale: string;
  label: string;
  countryCode: string;
  languageCode: string;
  direction: "ltr" | "rtl";
  dataForSeoLocationCode: number;
  dataForSeoLanguageCode: string;
};

export const supportedLocales = [
  {
    locale: "ar-SA",
    label: "العربية (السعودية)",
    countryCode: "SA",
    languageCode: "ar",
    direction: "rtl",
    dataForSeoLocationCode: 2682,
    dataForSeoLanguageCode: "ar",
  },
  {
    locale: "cs-CZ",
    label: "Čeština (Česko)",
    countryCode: "CZ",
    languageCode: "cs",
    direction: "ltr",
    dataForSeoLocationCode: 2203,
    dataForSeoLanguageCode: "cs",
  },
  {
    locale: "de-DE",
    label: "Deutsch (Deutschland)",
    countryCode: "DE",
    languageCode: "de",
    direction: "ltr",
    dataForSeoLocationCode: 2276,
    dataForSeoLanguageCode: "de",
  },
  {
    locale: "en-US",
    label: "English (United States)",
    countryCode: "US",
    languageCode: "en",
    direction: "ltr",
    dataForSeoLocationCode: 2840,
    dataForSeoLanguageCode: "en",
  },
  {
    locale: "es-ES",
    label: "Español (España)",
    countryCode: "ES",
    languageCode: "es",
    direction: "ltr",
    dataForSeoLocationCode: 2724,
    dataForSeoLanguageCode: "es",
  },
  {
    locale: "fr-FR",
    label: "Français (France)",
    countryCode: "FR",
    languageCode: "fr",
    direction: "ltr",
    dataForSeoLocationCode: 2250,
    dataForSeoLanguageCode: "fr",
  },
  {
    locale: "hi-IN",
    label: "हिन्दी (भारत)",
    countryCode: "IN",
    languageCode: "hi",
    direction: "ltr",
    dataForSeoLocationCode: 2356,
    dataForSeoLanguageCode: "hi",
  },
  {
    locale: "id-ID",
    label: "Bahasa Indonesia (Indonesia)",
    countryCode: "ID",
    languageCode: "id",
    direction: "ltr",
    dataForSeoLocationCode: 2360,
    dataForSeoLanguageCode: "id",
  },
  {
    locale: "it-IT",
    label: "Italiano (Italia)",
    countryCode: "IT",
    languageCode: "it",
    direction: "ltr",
    dataForSeoLocationCode: 2380,
    dataForSeoLanguageCode: "it",
  },
  {
    locale: "ja-JP",
    label: "日本語 (日本)",
    countryCode: "JP",
    languageCode: "ja",
    direction: "ltr",
    dataForSeoLocationCode: 2392,
    dataForSeoLanguageCode: "ja",
  },
  {
    locale: "ko-KR",
    label: "한국어 (대한민국)",
    countryCode: "KR",
    languageCode: "ko",
    direction: "ltr",
    dataForSeoLocationCode: 2410,
    dataForSeoLanguageCode: "ko",
  },
  {
    locale: "nl-NL",
    label: "Nederlands (Nederland)",
    countryCode: "NL",
    languageCode: "nl",
    direction: "ltr",
    dataForSeoLocationCode: 2528,
    dataForSeoLanguageCode: "nl",
  },
  {
    locale: "pl-PL",
    label: "Polski (Polska)",
    countryCode: "PL",
    languageCode: "pl",
    direction: "ltr",
    dataForSeoLocationCode: 2616,
    dataForSeoLanguageCode: "pl",
  },
  {
    locale: "pt-BR",
    label: "Português (Brasil)",
    countryCode: "BR",
    languageCode: "pt",
    direction: "ltr",
    dataForSeoLocationCode: 2076,
    dataForSeoLanguageCode: "pt",
  },
  {
    locale: "pt-PT",
    label: "Português (Portugal)",
    countryCode: "PT",
    languageCode: "pt",
    direction: "ltr",
    dataForSeoLocationCode: 2620,
    dataForSeoLanguageCode: "pt",
  },
  {
    locale: "ro-RO",
    label: "Română (România)",
    countryCode: "RO",
    languageCode: "ro",
    direction: "ltr",
    dataForSeoLocationCode: 2642,
    dataForSeoLanguageCode: "ro",
  },
  {
    locale: "sv-SE",
    label: "Svenska (Sverige)",
    countryCode: "SE",
    languageCode: "sv",
    direction: "ltr",
    dataForSeoLocationCode: 2752,
    dataForSeoLanguageCode: "sv",
  },
  {
    locale: "th-TH",
    label: "ไทย (ประเทศไทย)",
    countryCode: "TH",
    languageCode: "th",
    direction: "ltr",
    dataForSeoLocationCode: 2764,
    dataForSeoLanguageCode: "th",
  },
  {
    locale: "tr-TR",
    label: "Türkçe (Türkiye)",
    countryCode: "TR",
    languageCode: "tr",
    direction: "ltr",
    dataForSeoLocationCode: 2792,
    dataForSeoLanguageCode: "tr",
  },
  {
    locale: "vi-VN",
    label: "Tiếng Việt (Việt Nam)",
    countryCode: "VN",
    languageCode: "vi",
    direction: "ltr",
    dataForSeoLocationCode: 2704,
    dataForSeoLanguageCode: "vi",
  },
  {
    locale: "zh-Hant-TW",
    label: "繁體中文 (台灣)",
    countryCode: "TW",
    languageCode: "zh",
    direction: "ltr",
    dataForSeoLocationCode: 2158,
    dataForSeoLanguageCode: "zh-TW",
  },
] as const satisfies readonly SupportedLocale[];

export type SupportedLocaleCode = (typeof supportedLocales)[number]["locale"];

export const defaultLocale: SupportedLocaleCode = "en-US";

export function findSupportedLocale(locale: string) {
  return supportedLocales.find((item) => item.locale === locale);
}

export function findSupportedMarket(countryCode: string, languageCode: string) {
  const country = countryCode.trim().toUpperCase();
  const language = languageCode.trim().toLowerCase();

  return supportedLocales.find(
    (item) => item.countryCode === country && item.languageCode === language,
  );
}

export function localeLabel(locale: string) {
  return findSupportedLocale(locale)?.label ?? locale;
}

export function marketLabel(countryCode: string, languageCode: string) {
  return (
    findSupportedMarket(countryCode, languageCode)?.label ??
    `${countryCode.trim().toUpperCase()} · ${languageCode.trim().toLowerCase()}`
  );
}

export const supportedLocaleSchema = z
  .string()
  .trim()
  .refine(
    (locale): locale is SupportedLocaleCode =>
      Boolean(findSupportedLocale(locale)),
    "Choose a supported locale.",
  );

export function requireSupportedLocale(locale: string) {
  return findSupportedLocale(supportedLocaleSchema.parse(locale))!;
}
