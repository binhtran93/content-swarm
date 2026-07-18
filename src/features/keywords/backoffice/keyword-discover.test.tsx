import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeywordDiscover } from "@/features/keywords/backoffice/keyword-discover";

vi.mock("@/features/keywords/backoffice/discovery-actions.server", () => ({
  addDiscoveryResultsAction: vi.fn(),
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

const filterDiscovery = {
  ...discovery,
  results: [
    discovery.results[0],
    {
      keyword: "cancel subscriptions",
      searchVolume: 50,
      difficulty: 5,
      rank: 2,
    },
  ],
};

describe("Keyword discovery results actions", () => {
  it("submits selected rows from the header action", () => {
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
    expect(
      screen.queryByRole("button", { name: "Add to backlog" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Select subscription tracker"));
    const addButton = screen.getByRole("button", { name: "Add to backlog" });

    expect(selectionForm).toBeInstanceOf(HTMLFormElement);
    expect(addButton).toHaveAttribute("form", selectionForm!.id);
    expect(
      within(selectionForm!).getByDisplayValue("subscription tracker"),
    ).toHaveAttribute("name", "keywords");
    expect(screen.getByText("20 · Easy")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Run again (paid)" }),
    ).not.toBeInTheDocument();
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
      screen.queryByRole("button", { name: "Add to backlog" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Select subscription tracker"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("All discovered keywords are already in the backlog."),
    ).toBeInTheDocument();
  });

  it("filters results by search, minimum volume, and maximum difficulty", () => {
    render(
      <KeywordDiscover
        discoveries={[filterDiscovery]}
        existingNormalizedKeywords={[]}
        locations={locations}
        projectId="subiq"
        selected={filterDiscovery}
      />,
    );

    const search = screen.getByLabelText("Search discovery results");
    const minimumVolume = screen.getByLabelText("Minimum search volume");
    const maximumDifficulty = screen.getByLabelText(
      "Maximum keyword difficulty",
    );

    fireEvent.change(search, { target: { value: "cancel" } });
    expect(
      screen.queryByLabelText("Select subscription tracker"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Select cancel subscriptions"),
    ).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "" } });
    fireEvent.change(minimumVolume, { target: { value: "75" } });
    expect(
      screen.getByLabelText("Select subscription tracker"),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Select cancel subscriptions"),
    ).not.toBeInTheDocument();

    fireEvent.change(minimumVolume, { target: { value: "" } });
    fireEvent.change(maximumDifficulty, { target: { value: "10" } });
    expect(
      screen.queryByLabelText("Select subscription tracker"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Select cancel subscriptions"),
    ).toBeInTheDocument();
  });

  it("sorts results from the volume, difficulty, and rank headers", () => {
    render(
      <KeywordDiscover
        discoveries={[filterDiscovery]}
        existingNormalizedKeywords={[]}
        locations={locations}
        projectId="subiq"
        selected={filterDiscovery}
      />,
    );

    const keywordOrder = () =>
      within(document.getElementById("discovery-results-discovery-1")!)
        .getAllByRole("checkbox")
        .slice(1)
        .map((checkbox) =>
          checkbox.getAttribute("aria-label")?.replace("Select ", ""),
        );

    fireEvent.click(screen.getByRole("button", { name: "Sort by volume" }));
    expect(keywordOrder()).toEqual([
      "subscription tracker",
      "cancel subscriptions",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Sort by volume" }));
    expect(keywordOrder()).toEqual([
      "cancel subscriptions",
      "subscription tracker",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Sort by difficulty" }));
    expect(keywordOrder()).toEqual([
      "cancel subscriptions",
      "subscription tracker",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Sort by rank" }));
    expect(keywordOrder()).toEqual([
      "subscription tracker",
      "cancel subscriptions",
    ]);
  });

  it("selects and clears every visible keyword from the table header", () => {
    render(
      <KeywordDiscover
        discoveries={[filterDiscovery]}
        existingNormalizedKeywords={[]}
        locations={locations}
        projectId="subiq"
        selected={filterDiscovery}
      />,
    );

    const selectAll = screen.getByLabelText("Select all visible keywords");
    fireEvent.click(selectAll);

    expect(screen.getByLabelText("Select subscription tracker")).toBeChecked();
    expect(screen.getByLabelText("Select cancel subscriptions")).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Add to backlog" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('input[name="keywords"]')).toHaveLength(2);

    fireEvent.click(selectAll);
    expect(
      screen.queryByRole("button", { name: "Add to backlog" }),
    ).not.toBeInTheDocument();
  });
});
