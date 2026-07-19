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

const subiqMessagesByLocale = {
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

export type SubiqStaticLocale = keyof typeof subiqMessagesByLocale;

export const subiqStaticLocales = Object.freeze(
  Object.keys(subiqMessagesByLocale) as SubiqStaticLocale[],
);

export function isSubiqStaticLocale(
  locale: SupportedLocaleCode,
): locale is SubiqStaticLocale {
  return Object.hasOwn(subiqMessagesByLocale, locale);
}

export function resolveSubiqStaticLocale(
  locale: SupportedLocaleCode,
): SubiqStaticLocale {
  return isSubiqStaticLocale(locale) ? locale : defaultLocale;
}

export function getSubiqMessages(locale: SupportedLocaleCode) {
  return subiqMessagesByLocale[resolveSubiqStaticLocale(locale)];
}

export function getSubiqTranslator(locale: SupportedLocaleCode) {
  const resolved = resolveSubiqStaticLocale(locale);
  return createTranslator({
    locale: resolved,
    messages: subiqMessagesByLocale[resolved],
  });
}
