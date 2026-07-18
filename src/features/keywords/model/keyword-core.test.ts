import { describe, expect, it } from "vitest";

import { normalizeKeyword } from "@/features/keywords/model/keyword-input";
import { keywordIdeaSeeds } from "@/features/keywords/model/discovery-input";
import {
  discoveryRequestKey,
  normalizeDiscoveryRequest,
} from "@/features/keywords/service/discovery-request-key";
import {
  validateGroupInput,
  validateGroupKeywords,
} from "@/features/keywords/service/group-keywords.server";
import { keywordDocumentId } from "@/features/keywords/service/keyword-document-id";

const request = {
  method: "keyword_ideas" as const,
  input: " Subscription   Tracker ",
  countryCode: "us",
  languageCode: "EN",
  limit: 50 as const,
  minimumVolume: null,
  maximumDifficulty: 50,
};

describe("keyword identity and discovery normalization", () => {
  it("collapses whitespace and case for deterministic keyword IDs", () => {
    expect(normalizeKeyword("  Cancel   Subscriptions ")).toBe(
      "cancel subscriptions",
    );
    expect(keywordDocumentId("Cancel subscriptions", "US", "en")).toBe(
      keywordDocumentId(" cancel   SUBSCRIPTIONS ", "us", "EN"),
    );
    expect(keywordDocumentId("Cancel subscriptions", "VN", "en")).not.toBe(
      keywordDocumentId("Cancel subscriptions", "US", "en"),
    );
  });

  it("reuses semantically identical discovery requests", () => {
    expect(discoveryRequestKey(request)).toBe(
      discoveryRequestKey({ ...request, input: "subscription tracker" }),
    );
    expect(discoveryRequestKey(request)).not.toBe(
      discoveryRequestKey({ ...request, limit: 100 }),
    );
  });

  it("normalizes and deduplicates multiline keyword idea seeds", () => {
    const input =
      "Subscription tracker\n cancel   subscriptions \nSUBSCRIPTION TRACKER";
    expect(keywordIdeaSeeds(input)).toEqual([
      "subscription tracker",
      "cancel subscriptions",
    ]);
    expect(normalizeDiscoveryRequest({ ...request, input }).input).toBe(
      "subscription tracker\ncancel subscriptions",
    );
  });
});

describe("keyword grouping rules", () => {
  const keyword = {
    schemaVersion: 1 as const,
    keyword: "one",
    normalizedKeyword: "one",
    countryCode: "US",
    languageCode: "en",
    searchVolume: null,
    difficulty: null,
    sourceDiscoveryId: null,
    groupId: null,
    articleId: null,
    createdAt: null as never,
    updatedAt: null as never,
  };

  it("requires a unique primary member", () => {
    expect(validateGroupInput(["a", "b"], "a")).toEqual(["a", "b"]);
    expect(() => validateGroupInput(["a", "a"], "a")).toThrow("2 to 25");
    expect(() => validateGroupInput(["a", "b"], "c")).toThrow(
      "primary keyword",
    );
  });

  it("rejects mixed locales and existing groups without mutating input", () => {
    expect(() =>
      validateGroupKeywords([keyword, { ...keyword, countryCode: "VN" }], null),
    ).toThrow("same country and language");
    expect(() =>
      validateGroupKeywords([{ ...keyword, groupId: "another" }], null),
    ).toThrow("another group");
  });
});
