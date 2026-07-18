import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeywordDiscover } from "@/features/keywords/backoffice/keyword-discover";

vi.mock("@/features/keywords/backoffice/discovery-actions.server", () => ({
  addDiscoveryResultsAction: vi.fn(),
  rerunDiscoveryAction: vi.fn(),
  runDiscoveryAction: vi.fn(),
}));

const discovery = {
  discoveryId: "discovery-1",
  requestKey: "request-1",
  method: "competitor_website" as const,
  input: "example.com",
  countryCode: "US",
  languageCode: "en",
  limit: 50 as const,
  minimumVolume: null,
  maximumDifficulty: null,
  orderBy: ["rank,asc"],
  results: [
    {
      keyword: "subscription tracker",
      searchVolume: 100,
      difficulty: 20,
      rank: 1,
    },
  ],
  createdAt: "2026-07-18T00:00:00.000Z",
};

const locations = [
  {
    locationCode: 2840,
    locationName: "United States",
    countryCode: "US",
    languages: [{ languageCode: "en", languageName: "English" }],
  },
];

describe("Keyword discovery results actions", () => {
  it("submits selected rows from the header action while keeping rerun isolated", () => {
    render(
      <KeywordDiscover
        discoveries={[discovery]}
        existingNormalizedKeywords={[]}
        locations={locations}
        projectId="subiq"
        selected={discovery}
      />,
    );

    const selectionForm = document.getElementById(
      "discovery-results-discovery-1",
    );
    const addButton = screen.getByRole("button", {
      name: "Add selected to backlog",
    });
    const rerunButton = screen.getByRole("button", {
      name: "Run again (paid)",
    });

    expect(selectionForm).toBeInstanceOf(HTMLFormElement);
    expect(addButton).toHaveAttribute("form", selectionForm!.id);
    expect(
      within(selectionForm!).getByLabelText("Select subscription tracker"),
    ).toHaveAttribute("name", "keywords");
    expect(rerunButton.closest("form")).not.toBe(selectionForm);
  });

  it("disables the header action when every result is already in backlog", () => {
    render(
      <KeywordDiscover
        discoveries={[discovery]}
        existingNormalizedKeywords={["subscription tracker"]}
        locations={locations}
        projectId="subiq"
        selected={discovery}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Add selected to backlog" }),
    ).toBeDisabled();
  });
});
