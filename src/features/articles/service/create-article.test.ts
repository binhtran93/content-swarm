import { Timestamp } from "firebase-admin/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createArticle } from "@/features/articles/service/create-article.server";

const mock = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
  generated: 0,
  ownerUid: "owner-a",
}));

function snapshot(path: string) {
  const data = mock.documents.get(path);
  return {
    id: path.split("/").at(-1),
    exists: Boolean(data),
    data: () => data,
  };
}

function reference(path: string): {
  id: string;
  path: string;
  collection: (name: string) => ReturnType<typeof collection>;
} {
  return {
    id: path.split("/").at(-1)!,
    path,
    collection: (name) => collection(`${path}/${name}`),
  };
}

function collection(path: string) {
  return {
    doc: (id?: string) =>
      reference(`${path}/${id ?? `generated-${++mock.generated}`}`),
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
    }) => Promise<T>,
  ) =>
    operation({
      get: async (target) => snapshot(target.path),
      getAll: async (...targets) =>
        targets.map((target) => snapshot(target.path)),
      create: (target, value) => {
        if (mock.documents.has(target.path)) throw new Error("already exists");
        mock.documents.set(target.path, value);
      },
      update: (target, value) =>
        mock.documents.set(target.path, {
          ...mock.documents.get(target.path),
          ...value,
        }),
    }),
};

vi.mock("@/features/auth/server/require-owner.server", () => ({
  requireOwner: async () => ({ uid: mock.ownerUid }),
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
    description: "",
    topics: [],
    canonicalBaseUrl: null,
    status: "active",
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  });
  return now;
}

function seedKeyword(
  id: string,
  now: Timestamp,
  groupId: string | null = null,
) {
  mock.documents.set(`projects/subiq/keywords/${id}`, {
    schemaVersion: 1,
    keyword: id,
    normalizedKeyword: id,
    countryCode: "US",
    languageCode: "en",
    searchVolume: null,
    difficulty: null,
    sourceDiscoveryId: null,
    groupId,
    articleId: null,
    createdAt: now,
    updatedAt: now,
  });
}

describe("createArticle", () => {
  beforeEach(() => {
    mock.documents.clear();
    mock.generated = 0;
    mock.ownerUid = "owner-a";
  });

  it("creates one draft and prevents a second assignment", async () => {
    const now = seedProject();
    seedKeyword("primary", now);
    const article = await createArticle("subiq", "primary", "en-US");
    expect(article.keywordId).toBe("primary");
    expect(article.status).toBe("draft");
    expect(
      mock.documents.get("projects/subiq/keywords/primary")?.articleId,
    ).toBe(article.articleId);
    await expect(createArticle("subiq", "primary", "en-US")).rejects.toThrow(
      "already assigned",
    );
    expect(
      [...mock.documents.keys()].filter((path) => path.includes("/articles/")),
    ).toHaveLength(1);
  });

  it("assigns every group member while storing only the primary keyword", async () => {
    const now = seedProject();
    seedKeyword("primary", now, "group-1");
    seedKeyword("supporting", now, "group-1");
    mock.documents.set("projects/subiq/keywordGroups/group-1", {
      schemaVersion: 1,
      name: null,
      primaryKeywordId: "primary",
      memberKeywordIds: ["primary", "supporting"],
      createdAt: now,
      updatedAt: now,
    });
    const article = await createArticle("subiq", "primary", "en-US");
    expect(
      mock.documents.get("projects/subiq/keywords/supporting")?.articleId,
    ).toBe(article.articleId);
    expect(
      mock.documents.get(`projects/subiq/articles/${article.articleId}`),
    ).not.toHaveProperty("memberKeywordIds");
  });

  it("rejects cross-owner project IDs without writing", async () => {
    const now = seedProject();
    seedKeyword("primary", now);
    mock.ownerUid = "owner-b";
    await expect(createArticle("subiq", "primary", "en-US")).rejects.toThrow(
      "unavailable",
    );
    expect(
      [...mock.documents.keys()].some((path) => path.includes("/articles/")),
    ).toBe(false);
  });
});
