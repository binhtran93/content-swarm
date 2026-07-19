import { createTranslator } from "next-intl";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import enUS from "./translations/en-US.json";
import viVN from "./translations/vi-VN.json";

const subiqMessagesByLocale = {
  "en-US": enUS,
  "vi-VN": viVN,
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
