import { beforeEach, describe, expect, it, vi } from "vitest";

import { runDiscoveryAction } from "@/features/keywords/backoffice/discovery-actions.server";

const mocks = vi.hoisted(() => ({
  appendProjectCompetitor: vi.fn(),
  getOrReuseDiscovery: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/features/keywords/service/get-or-reuse-discovery.server", () => ({
  getOrReuseDiscovery: mocks.getOrReuseDiscovery,
}));
vi.mock("@/features/projects/service/append-project-competitor.server", () => ({
  appendProjectCompetitor: mocks.appendProjectCompetitor,
}));
vi.mock("@/features/keywords/service/add-results-to-backlog.server", () => ({
  addResultsToBacklog: vi.fn(),
}));
vi.mock("@/features/keywords/service/remove-discovery.server", () => ({
  removeDiscovery: vi.fn(),
}));

function discoveryForm(method: "competitor_website" | "related_keywords") {
  const formData = new FormData();
  formData.set("projectId", "subiq");
  formData.set("method", method);
  formData.set("input", "https://Competitor.com/pricing");
  formData.set("locale", "en-US");
  formData.set("limit", "50");
  return formData;
}

describe("runDiscoveryAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([false, true])(
    "saves the normalized competitor after a successful discovery (reused: %s)",
    async (reused) => {
      mocks.getOrReuseDiscovery.mockResolvedValue({
        discovery: {
          discoveryId: "discovery-1",
          input: "competitor.com",
        },
        reused,
      });

      await runDiscoveryAction(null, discoveryForm("competitor_website"));

      expect(mocks.appendProjectCompetitor).toHaveBeenCalledWith(
        "subiq",
        "competitor.com",
      );
      expect(mocks.redirect).toHaveBeenCalledWith(
        "/admin/projects/subiq/keywords?view=discover&discovery=discovery-1",
      );
    },
  );

  it("does not save a competitor for another discovery method", async () => {
    mocks.getOrReuseDiscovery.mockResolvedValue({
      discovery: { discoveryId: "discovery-1", input: "competitor.com" },
      reused: false,
    });

    await runDiscoveryAction(null, discoveryForm("related_keywords"));

    expect(mocks.appendProjectCompetitor).not.toHaveBeenCalled();
  });

  it("does not save a competitor when discovery fails", async () => {
    mocks.getOrReuseDiscovery.mockRejectedValue(new Error("provider failed"));

    await expect(
      runDiscoveryAction(null, discoveryForm("competitor_website")),
    ).resolves.toEqual({ error: "The discovery could not be completed." });
    expect(mocks.appendProjectCompetitor).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
