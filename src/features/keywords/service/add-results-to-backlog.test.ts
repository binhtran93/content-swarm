import { expect, it, vi } from "vitest";

import { addResultsToBacklog } from "@/features/keywords/service/add-results-to-backlog.server";

const mocks = vi.hoisted(() => ({
  addKeywords: vi.fn().mockResolvedValue({ created: [], skipped: 0 }),
  getDiscovery: vi.fn().mockResolvedValue({
    discoveryId: "discovery-1",
    countryCode: "US",
    languageCode: "en",
    results: [
      {
        keyword: "subscription tracker",
        searchVolume: 100,
        difficulty: 20,
        rank: null,
        relevanceOrder: 4,
      },
    ],
  }),
}));

vi.mock("@/features/keywords/service/add-keywords.server", () => ({
  addKeywords: mocks.addKeywords,
}));

vi.mock("@/features/keywords/service/get-discovery.server", () => ({
  getDiscovery: mocks.getDiscovery,
}));

it("copies discovery relevance order into the backlog input", async () => {
  await addResultsToBacklog("subiq", "discovery-1", ["subscription tracker"]);

  expect(mocks.addKeywords).toHaveBeenCalledWith("subiq", [
    expect.objectContaining({
      keyword: "subscription tracker",
      sourceDiscoveryId: "discovery-1",
      relevanceOrder: 4,
    }),
  ]);
});
