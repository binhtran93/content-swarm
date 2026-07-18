import { Timestamp } from "firebase-admin/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { addKeyword } from "@/features/keywords/service/add-keyword.server";
import { addKeywords } from "@/features/keywords/service/add-keywords.server";
import { createKeywordGroup } from "@/features/keywords/service/create-keyword-group.server";

const mock = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
  generatedId: 0,
  ownerUid: "owner-a",
  requireOwner: vi.fn(),
}));

function snapshot(path: string) {
  const value = mock.documents.get(path);
  return {
    id: path.split("/").at(-1),
    exists: Boolean(value),
    data: () => value,
    ref: reference(path),
  };
}

function collection(path: string) {
  return {
    doc: (id?: string) =>
      reference(`${path}/${id ?? `generated-${++mock.generatedId}`}`),
  };
}

function reference(path: string): {
  id: string;
  path: string;
  collection: typeof collection;
} {
  return {
    id: path.split("/").at(-1)!,
    path,
    collection: (name: string) => collection(`${path}/${name}`),
  };
}

const firestore = {
  collection,
  runTransaction: async <T>(
    operation: (transaction: {
      get: (target: { path: string }) => Promise<ReturnType<typeof snapshot>>;
      getAll: (
        ...targets: { path: string }[]
      ) => Promise<ReturnType<typeof snapshot>[]>;
      create: (
        target: { path: string },
        value: Record<string, unknown>,
      ) => void;
      update: (
        target: { path: string },
        value: Record<string, unknown>,
      ) => void;
      delete: (target: { path: string }) => void;
    }) => Promise<T>,
  ) =>
    operation({
      get: async (target) => snapshot(target.path),
      getAll: async (...targets) =>
        targets.map((target) => snapshot(target.path)),
      create: (target, value) => mock.documents.set(target.path, value),
      update: (target, value) =>
        mock.documents.set(target.path, {
          ...mock.documents.get(target.path),
          ...value,
        }),
      delete: (target) => mock.documents.delete(target.path),
    }),
};

vi.mock("@/features/auth/server/require-owner.server", () => ({
  requireOwner: mock.requireOwner,
}));
vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => firestore,
}));

function seedProject() {
  const now = Timestamp.now();
  mock.documents.set("projects/subiq", {
    schemaVersion: 1,
    ownerId: "owner-a",
    name: "SubIQ",
    description: "Subscription intelligence",
    topics: [],
    canonicalBaseUrl: null,
    status: "active",
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  });
}

describe("keyword commands", () => {
  beforeEach(() => {
    mock.documents.clear();
    mock.generatedId = 0;
    mock.ownerUid = "owner-a";
    mock.requireOwner.mockReset();
    mock.requireOwner.mockImplementation(async () => ({ uid: mock.ownerUid }));
    seedProject();
  });

  it("uses deterministic identity to skip normalized and concurrent duplicates", async () => {
    const first = await addKeywords("subiq", [
      {
        keyword: " Cancel   Subscriptions ",
        countryCode: "us",
        languageCode: "EN",
      },
      {
        keyword: "cancel subscriptions",
        countryCode: "US",
        languageCode: "en",
      },
      { keyword: "   ", countryCode: "US", languageCode: "en" },
    ]);
    expect(first.created).toHaveLength(1);
    expect(first.skipped).toBe(2);
    await expect(
      addKeyword("subiq", {
        keyword: "CANCEL SUBSCRIPTIONS",
        countryCode: "US",
        languageCode: "en",
      }),
    ).rejects.toThrow("already in the backlog");
    expect(
      [...mock.documents.keys()].filter((path) => path.includes("/keywords/")),
    ).toHaveLength(1);
  });

  it("groups compatible keywords and rejects cross-market partial writes", async () => {
    const added = await addKeywords("subiq", [
      {
        keyword: "cancel subscriptions",
        countryCode: "US",
        languageCode: "en",
      },
      {
        keyword: "subscription manager",
        countryCode: "US",
        languageCode: "en",
      },
      { keyword: "huy dang ky", countryCode: "VN", languageCode: "vi" },
    ]);
    const [first, second, third] = added.created;
    const group = await createKeywordGroup("subiq", [
      first!.keywordId,
      second!.keywordId,
    ]);
    expect(group.memberKeywordIds).toEqual([
      first!.keywordId,
      second!.keywordId,
    ]);
    expect(
      mock.documents.get(`projects/subiq/keywords/${first!.keywordId}`)
        ?.groupId,
    ).toBe(group.groupId);

    const groupCount = [...mock.documents.keys()].filter((path) =>
      path.includes("/keywordGroups/"),
    ).length;
    await expect(
      createKeywordGroup("subiq", [second!.keywordId, third!.keywordId]),
    ).rejects.toThrow();
    expect(
      [...mock.documents.keys()].filter((path) =>
        path.includes("/keywordGroups/"),
      ),
    ).toHaveLength(groupCount);
  });

  it("automatically chooses a primary and flattens group merges", async () => {
    const added = await addKeywords(
      "subiq",
      ["alpha", "beta", "gamma", "delta", "epsilon"].map((keyword) => ({
        keyword,
        countryCode: "US",
        languageCode: "en",
      })),
    );
    const [alpha, beta, gamma, delta, epsilon] = added.created;
    const metrics = [
      [alpha!.keywordId, 100, 30],
      [beta!.keywordId, 100, 10],
      [gamma!.keywordId, 50, 5],
      [delta!.keywordId, 40, 5],
      [epsilon!.keywordId, 200, 50],
    ] as const;
    metrics.forEach(([id, searchVolume, difficulty]) => {
      const path = `projects/subiq/keywords/${id}`;
      mock.documents.set(path, {
        ...mock.documents.get(path),
        searchVolume,
        difficulty,
      });
    });

    const firstGroup = await createKeywordGroup("subiq", [
      alpha!.keywordId,
      beta!.keywordId,
    ]);
    expect(firstGroup.primaryKeywordId).toBe(beta!.keywordId);
    const secondGroup = await createKeywordGroup("subiq", [
      gamma!.keywordId,
      delta!.keywordId,
    ]);

    const mergedGroups = await createKeywordGroup("subiq", [
      firstGroup.primaryKeywordId,
      secondGroup.primaryKeywordId,
    ]);
    expect(mergedGroups.memberKeywordIds).toHaveLength(4);
    expect(mergedGroups.primaryKeywordId).toBe(beta!.keywordId);
    expect(mergedGroups.groupId).not.toBe(firstGroup.groupId);
    expect(
      mock.documents.has(`projects/subiq/keywordGroups/${firstGroup.groupId}`),
    ).toBe(false);
    expect(
      mock.documents.has(`projects/subiq/keywordGroups/${secondGroup.groupId}`),
    ).toBe(false);

    const mergedWithKeyword = await createKeywordGroup("subiq", [
      mergedGroups.primaryKeywordId,
      epsilon!.keywordId,
    ]);
    expect(mergedWithKeyword.memberKeywordIds).toHaveLength(5);
    expect(mergedWithKeyword.primaryKeywordId).toBe(epsilon!.keywordId);
    mergedWithKeyword.memberKeywordIds.forEach((id) => {
      expect(mock.documents.get(`projects/subiq/keywords/${id}`)?.groupId).toBe(
        mergedWithKeyword.groupId,
      );
    });
  });

  it("keeps project data isolated by verified ownership", async () => {
    mock.ownerUid = "owner-b";
    await expect(
      addKeyword("subiq", {
        keyword: "stolen keyword",
        countryCode: "US",
        languageCode: "en",
      }),
    ).rejects.toThrow("unavailable");
  });
});
