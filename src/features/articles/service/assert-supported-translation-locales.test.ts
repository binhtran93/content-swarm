import { describe, expect, it } from "vitest";

import { assertSupportedTranslationLocales } from "@/features/articles/service/assert-supported-translation-locales";

describe("supported translation locales", () => {
  it("accepts a different supported target", () => {
    expect(() =>
      assertSupportedTranslationLocales("en-US", "zh-Hant-TW"),
    ).not.toThrow();
  });

  it("rejects the source locale and arbitrary targets", () => {
    expect(() => assertSupportedTranslationLocales("en-US", "en-US")).toThrow(
      "different supported target locale",
    );
    expect(() => assertSupportedTranslationLocales("en-US", "ru-RU")).toThrow(
      "different supported target locale",
    );
  });

  it("rejects unsupported legacy source locales", () => {
    expect(() => assertSupportedTranslationLocales("ru-RU", "en-US")).toThrow(
      "source locale is no longer supported",
    );
  });
});
