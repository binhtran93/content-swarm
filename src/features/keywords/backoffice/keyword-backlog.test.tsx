import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeywordBacklog } from "@/features/keywords/backoffice/keyword-backlog";

vi.mock("@/features/keywords/backoffice/keyword-actions.server", () => ({
  createKeywordGroupAction: vi.fn(),
  dissolveKeywordGroupAction: vi.fn(),
  updateKeywordAction: vi.fn(),
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

    fireEvent.click(within(table).getByLabelText("Select primary keyword"));
    fireEvent.click(within(table).getByLabelText("Select single keyword"));

    expect(
      screen.queryByRole("combobox", { name: "Primary keyword" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to group" }),
    ).toBeInTheDocument();
  });
});
