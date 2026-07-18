import { describe, expect, it } from "vitest";

import {
  parseDiscoveryPayload,
  parseLocationCatalogue,
} from "@/features/keywords/provider/fetch-keyword-discovery.server";

function response(items: unknown[]) {
  return {
    status_code: 20000,
    tasks: [{ status_code: 20000, result: [{ items }] }],
  };
}

describe("DataForSEO projected response contracts", () => {
  it("projects Google-supported country and language catalogue entries", () => {
    expect(
      parseLocationCatalogue(
        response([
          {
            location_code: 2840,
            location_name: "United States",
            country_iso_code: "US",
            available_languages: [
              {
                available_sources: ["google", "bing"],
                language_name: "English",
                language_code: "en",
              },
              {
                available_sources: ["bing"],
                language_name: "Unsupported",
                language_code: "xx",
              },
            ],
          },
        ]),
      ),
    ).toEqual([
      {
        locationCode: 2840,
        locationName: "United States",
        countryCode: "US",
        languages: [{ languageCode: "en", languageName: "English" }],
      },
    ]);
  });

  it("projects keyword ideas without retaining raw provider fields", () => {
    expect(
      parseDiscoveryPayload(
        "keyword_ideas",
        response([
          {
            keyword: "subscription tracker",
            keyword_info: { search_volume: 1200 },
            keyword_properties: { keyword_difficulty: 42 },
            ignored_raw_field: { large: true },
          },
        ]),
        50,
      ),
    ).toEqual([
      {
        keyword: "subscription tracker",
        searchVolume: 1200,
        difficulty: 42,
        rank: null,
      },
    ]);
  });

  it("projects related and competitor nested keyword data", () => {
    const nested = {
      keyword_data: {
        keyword: "cancel subscriptions",
        keyword_info: { search_volume: 900 },
        keyword_properties: { keyword_difficulty: 31 },
      },
      ranked_serp_element: { serp_item: { rank_group: 4 } },
    };
    expect(
      parseDiscoveryPayload("related_keywords", response([nested]), 50)[0]
        ?.rank,
    ).toBeNull();
    expect(
      parseDiscoveryPayload("competitor_website", response([nested]), 50),
    ).toEqual([
      {
        keyword: "cancel subscriptions",
        searchVolume: 900,
        difficulty: 31,
        rank: 4,
      },
    ]);
  });

  it("preserves successful empty results", () => {
    expect(parseDiscoveryPayload("keyword_ideas", response([]), 50)).toEqual(
      [],
    );
  });
});
