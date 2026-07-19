import { describe, expect, it } from "vitest";

import { discoveryRequestSchema } from "@/features/keywords/model/discovery-input";
import { keywordInputSchema } from "@/features/keywords/model/keyword-input";

describe("supported keyword markets", () => {
  it("accepts a catalog market", () => {
    expect(
      keywordInputSchema.parse({
        keyword: "subscription tracker",
        countryCode: "us",
        languageCode: "EN",
      }),
    ).toMatchObject({ countryCode: "US", languageCode: "en" });
  });

  it("rejects a well-formed market outside the catalog", () => {
    expect(() =>
      keywordInputSchema.parse({
        keyword: "keyword",
        countryCode: "CA",
        languageCode: "en",
      }),
    ).toThrow("Choose a supported market.");
  });

  it("rejects a tampered discovery market", () => {
    expect(() =>
      discoveryRequestSchema.parse({
        method: "keyword_ideas",
        input: "keyword",
        countryCode: "RU",
        languageCode: "ru",
        limit: 50,
      }),
    ).toThrow("Choose a supported market.");
  });
});
