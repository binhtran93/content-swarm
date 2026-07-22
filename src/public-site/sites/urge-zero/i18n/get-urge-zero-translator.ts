import { createTranslator } from "next-intl";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import arSA from "./translations/ar-SA.json";
import csCZ from "./translations/cs-CZ.json";
import deDE from "./translations/de-DE.json";
import enUS from "./translations/en-US.json";
import esES from "./translations/es-ES.json";
import frFR from "./translations/fr-FR.json";
import hiIN from "./translations/hi-IN.json";
import idID from "./translations/id-ID.json";
import itIT from "./translations/it-IT.json";
import jaJP from "./translations/ja-JP.json";
import koKR from "./translations/ko-KR.json";
import nlNL from "./translations/nl-NL.json";
import plPL from "./translations/pl-PL.json";
import ptBR from "./translations/pt-BR.json";
import ptPT from "./translations/pt-PT.json";
import roRO from "./translations/ro-RO.json";
import svSE from "./translations/sv-SE.json";
import thTH from "./translations/th-TH.json";
import trTR from "./translations/tr-TR.json";
import viVN from "./translations/vi-VN.json";
import zhHantTW from "./translations/zh-Hant-TW.json";

const urgeZeroMessagesByLocale = {
  "ar-SA": arSA,
  "cs-CZ": csCZ,
  "de-DE": deDE,
  "en-US": enUS,
  "es-ES": esES,
  "fr-FR": frFR,
  "hi-IN": hiIN,
  "id-ID": idID,
  "it-IT": itIT,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "nl-NL": nlNL,
  "pl-PL": plPL,
  "pt-BR": ptBR,
  "pt-PT": ptPT,
  "ro-RO": roRO,
  "sv-SE": svSE,
  "th-TH": thTH,
  "tr-TR": trTR,
  "vi-VN": viVN,
  "zh-Hant-TW": zhHantTW,
} as const satisfies Partial<Record<SupportedLocaleCode, typeof enUS>>;

export type UrgeZeroStaticLocale = keyof typeof urgeZeroMessagesByLocale;

export const urgeZeroStaticLocales = Object.freeze(
  Object.keys(urgeZeroMessagesByLocale) as UrgeZeroStaticLocale[],
);

export function isUrgeZeroStaticLocale(
  locale: SupportedLocaleCode,
): locale is UrgeZeroStaticLocale {
  return Object.hasOwn(urgeZeroMessagesByLocale, locale);
}

export function resolveUrgeZeroStaticLocale(
  locale: SupportedLocaleCode,
): UrgeZeroStaticLocale {
  return isUrgeZeroStaticLocale(locale) ? locale : defaultLocale;
}

export function getUrgeZeroMessages(locale: SupportedLocaleCode) {
  return urgeZeroMessagesByLocale[resolveUrgeZeroStaticLocale(locale)];
}

export function getUrgeZeroTranslator(locale: SupportedLocaleCode) {
  const resolved = resolveUrgeZeroStaticLocale(locale);
  return createTranslator({
    locale: resolved,
    messages: urgeZeroMessagesByLocale[resolved],
  });
}
