import { afterEach, describe, expect, it, vi } from "vitest";

import {
  fetchKeywordDiscovery,
  parseDiscoveryPayload,
} from "@/features/keywords/provider/fetch-keyword-discovery.server";

function response(items: unknown[]) {
  return {
    status_code: 20000,
    tasks: [{ status_code: 20000, result: [{ items }] }],
  };
}

describe("DataForSEO projected response contracts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
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
        relevanceOrder: 1,
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
        relevanceOrder: 1,
      },
    ]);
  });

  it("preserves the one-based position from the provider response", () => {
    const items = [
      null,
      {
        keyword: "second valid result",
        keyword_info: { search_volume: 10 },
        keyword_properties: { keyword_difficulty: 5 },
      },
    ];

    expect(parseDiscoveryPayload("keyword_ideas", response(items), 50)).toEqual(
      [
        {
          keyword: "second valid result",
          searchVolume: 10,
          difficulty: 5,
          rank: null,
          relevanceOrder: 2,
        },
      ],
    );
  });

  it("preserves successful empty results", () => {
    expect(parseDiscoveryPayload("keyword_ideas", response([]), 50)).toEqual(
      [],
    );
  });

  it("sends the fixed Traditional Chinese provider mapping", async () => {
    vi.stubEnv("DATAFORSEO_ALLOW_TEST_NETWORK", "1");
    vi.stubEnv("DATAFORSEO_LOGIN", "login");
    vi.stubEnv("DATAFORSEO_PASSWORD", "password");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(response([])), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchKeywordDiscovery({
      method: "keyword_ideas",
      input: "訂閱管理",
      countryCode: "TW",
      languageCode: "zh",
      limit: 50,
      minimumVolume: null,
      maximumDifficulty: null,
    });

    const [, request] = fetchMock.mock.calls[0]!;
    const payload = JSON.parse(String(request.body));

    expect(payload[0]).toMatchObject({
      location_code: 2158,
      language_code: "zh-TW",
    });
  });
});
