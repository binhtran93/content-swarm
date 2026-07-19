import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  findSupportedLocale,
  findSupportedMarket,
  supportedLocales,
} from "@/config/supported-locales";

describe("supported locales", () => {
  it("defines unique locales and keyword markets", () => {
    expect(supportedLocales).toHaveLength(21);
    expect(new Set(supportedLocales.map((item) => item.locale)).size).toBe(21);
    expect(
      new Set(
        supportedLocales.map(
          (item) => `${item.countryCode}:${item.languageCode}`,
        ),
      ).size,
    ).toBe(21);
    expect(
      supportedLocales.every(
        (item) =>
          Number.isInteger(item.dataForSeoLocationCode) &&
          item.dataForSeoLocationCode > 0 &&
          item.dataForSeoLanguageCode.length > 0,
      ),
    ).toBe(true);
  });

  it("defaults to United States English", () => {
    expect(defaultLocale).toBe("en-US");
    expect(findSupportedMarket("US", "en")?.locale).toBe("en-US");
  });

  it("maps Traditional Chinese to the DataForSEO Taiwan market", () => {
    expect(findSupportedLocale("zh-Hant-TW")).toMatchObject({
      countryCode: "TW",
      languageCode: "zh",
      dataForSeoLocationCode: 2158,
      dataForSeoLanguageCode: "zh-TW",
    });
  });
});
