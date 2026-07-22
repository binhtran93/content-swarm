import { createTranslator } from "next-intl";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import enUS from "./translations/en-US.json";
import arSA from "./translations/ar-SA.json";
import csCZ from "./translations/cs-CZ.json";
import deDE from "./translations/de-DE.json";
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

const jlensMessagesByLocale = {
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

export type JlensStaticLocale = keyof typeof jlensMessagesByLocale;

export const jlensStaticLocales = Object.freeze(
  Object.keys(jlensMessagesByLocale) as JlensStaticLocale[],
);

export function isJlensStaticLocale(
  locale: SupportedLocaleCode,
): locale is JlensStaticLocale {
  return Object.hasOwn(jlensMessagesByLocale, locale);
}

export function resolveJlensStaticLocale(
  locale: SupportedLocaleCode,
): JlensStaticLocale {
  return isJlensStaticLocale(locale) ? locale : defaultLocale;
}

export function getJlensMessages(locale: SupportedLocaleCode) {
  return jlensMessagesByLocale[resolveJlensStaticLocale(locale)];
}

export function getJlensTranslator(locale: SupportedLocaleCode) {
  const resolved = resolveJlensStaticLocale(locale);
  return createTranslator({
    locale: resolved,
    messages: jlensMessagesByLocale[resolved],
  });
}
