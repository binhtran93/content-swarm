import { z } from "zod";

import { findSupportedMarket } from "@/config/supported-locales";

export const normalizeKeyword = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");

export const countryCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]{2}$/, "Use a two-letter country code."));

export const languageCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase())
  .pipe(
    z.string().regex(/^[a-z]{2,3}$/, "Use a language code such as en or vi."),
  );

export const keywordInputSchema = z
  .object({
    keyword: z
      .string()
      .transform((value) => value.trim().replace(/\s+/g, " "))
      .pipe(z.string().min(1, "Keyword is required.").max(200)),
    countryCode: countryCodeSchema,
    languageCode: languageCodeSchema,
    searchVolume: z.number().int().nonnegative().nullable().default(null),
    difficulty: z.number().min(0).max(100).nullable().default(null),
    sourceDiscoveryId: z.string().min(1).nullable().default(null),
  })
  .refine(
    (input) => findSupportedMarket(input.countryCode, input.languageCode),
    "Choose a supported market.",
  );
