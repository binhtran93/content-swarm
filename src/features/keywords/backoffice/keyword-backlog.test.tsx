import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeywordBacklog } from "@/features/keywords/backoffice/keyword-backlog";

vi.mock("@/features/keywords/backoffice/keyword-actions.server", () => ({
  createKeywordGroupAction: vi.fn(),
  dissolveKeywordGroupAction: vi.fn(),
  removeSelectedKeywordsAction: vi.fn(),
}));

const timestamp = "2026-07-18T00:00:00.000Z";
const keywords = [
  {
    keywordId: "supporting",
    keyword: "supporting keyword",
    normalizedKeyword: "supporting keyword",
    countryCode: "US",
    languageCode: "en",
    searchVolume: 100,
    difficulty: 20,
    sourceDiscoveryId: null,
    groupId: "group-1",
    articleId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    keywordId: "primary",
    keyword: "primary keyword",
    normalizedKeyword: "primary keyword",
    countryCode: "US",
    languageCode: "en",
    searchVolume: 200,
    difficulty: 30,
    sourceDiscoveryId: null,
    groupId: "group-1",
    articleId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    keywordId: "single",
    keyword: "single keyword",
    normalizedKeyword: "single keyword",
    countryCode: "US",
    languageCode: "en",
    searchVolume: 50,
    difficulty: 5,
    sourceDiscoveryId: null,
    groupId: null,
    articleId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    keywordId: "assigned",
    keyword: "assigned keyword",
    normalizedKeyword: "assigned keyword",
    countryCode: "US",
    languageCode: "en",
    searchVolume: 500,
    difficulty: 80,
    sourceDiscoveryId: null,
    groupId: null,
    articleId: "article-1",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

const groups = [
  {
    groupId: "group-1",
    name: null,
    primaryKeywordId: "primary",
    memberKeywordIds: ["supporting", "primary"],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

describe("Keyword backlog grouping", () => {
  it("shows only group primaries and merges selected rows without a primary picker", () => {
    render(
      <KeywordBacklog groups={groups} keywords={keywords} projectId="subiq" />,
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText("primary keyword")).toBeInTheDocument();
    expect(within(table).getByText("single keyword")).toBeInTheDocument();
    expect(
      within(table).queryByText("supporting keyword"),
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("assigned keyword"),
    ).not.toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Volume" }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Difficulty" }),
    ).toBeInTheDocument();
    expect(within(table).getByText("5 · Very easy")).toBeInTheDocument();
    expect(screen.queryByLabelText("Filter by status")).not.toBeInTheDocument();
    expect(screen.queryByText("Keyword groups")).not.toBeInTheDocument();

    fireEvent.click(
      within(table).getByRole("button", {
        name: "View group for primary keyword",
      }),
    );
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("supporting keyword")).toBeInTheDocument();
    expect(within(dialog).getAllByText("primary keyword")).toHaveLength(2);
    expect(within(dialog).getByText("Primary")).toBeInTheDocument();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Dissolve group" }),
    );
    expect(screen.getByText("Dissolve this group?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Close" }),
    );

    fireEvent.click(within(table).getByLabelText("Select primary keyword"));
    fireEvent.click(within(table).getByLabelText("Select single keyword"));

    expect(
      screen.queryByRole("combobox", { name: "Primary keyword" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to group" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove from backlog" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from backlog" }),
    );
    const removalDialog = screen.getByRole("dialog");
    expect(
      within(removalDialog).getByText("Remove selected from backlog?"),
    ).toBeInTheDocument();
    expect(
      within(removalDialog).getByRole("button", {
        name: "Remove from backlog",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("selects all visible selectable backlog rows", () => {
    render(
      <KeywordBacklog groups={groups} keywords={keywords} projectId="subiq" />,
    );

    fireEvent.click(
      screen.getByLabelText("Select all visible backlog keywords"),
    );

    expect(screen.getByLabelText("Select primary keyword")).toBeChecked();
    expect(screen.getByLabelText("Select single keyword")).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Remove from backlog" }),
    ).toBeInTheDocument();
  });

  it("filters and sorts backlog metrics", () => {
    render(
      <KeywordBacklog groups={groups} keywords={keywords} projectId="subiq" />,
    );

    const table = screen.getByRole("table");
    const rowOrder = () =>
      within(table)
        .getAllByRole("checkbox")
        .slice(1)
        .map((checkbox) =>
          checkbox.getAttribute("aria-label")?.replace("Select ", ""),
        );
    const minimumVolume = screen.getByLabelText(
      "Minimum backlog search volume",
    );
    const maximumDifficulty = screen.getByLabelText(
      "Maximum backlog keyword difficulty",
    );

    fireEvent.change(minimumVolume, { target: { value: "100" } });
    expect(rowOrder()).toEqual(["primary keyword"]);

    fireEvent.change(minimumVolume, { target: { value: "" } });
    fireEvent.change(maximumDifficulty, { target: { value: "10" } });
    expect(rowOrder()).toEqual(["single keyword"]);

    fireEvent.change(maximumDifficulty, { target: { value: "" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Sort backlog by volume" }),
    );
    expect(rowOrder()).toEqual(["primary keyword", "single keyword"]);
    fireEvent.click(
      screen.getByRole("button", { name: "Sort backlog by volume" }),
    );
    expect(rowOrder()).toEqual(["single keyword", "primary keyword"]);

    fireEvent.click(
      screen.getByRole("button", { name: "Sort backlog by difficulty" }),
    );
    expect(rowOrder()).toEqual(["single keyword", "primary keyword"]);
  });
});
