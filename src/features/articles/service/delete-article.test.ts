import { Timestamp } from "firebase-admin/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteArticle } from "@/features/articles/service/delete-article.server";

const mock = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
  ownerUid: "owner-a",
}));

type Reference = {
  id: string;
  path: string;
  collection: (name: string) => Collection;
};

type Query = {
  path: string;
  field: string;
  value: unknown;
};

type Collection = {
  path: string;
  doc: (id: string) => Reference;
  where: (field: string, operator: string, value: unknown) => Query;
};

function reference(path: string): Reference {
  return {
    id: path.split("/").at(-1)!,
    path,
    collection: (name) => collection(`${path}/${name}`),
  };
}

function collection(path: string): Collection {
  return {
    path,
    doc: (id) => reference(`${path}/${id}`),
    where: (field, _operator, value) => ({ path, field, value }),
  };
}

function documentSnapshot(path: string) {
  const value = mock.documents.get(path);
  return {
    id: path.split("/").at(-1)!,
    exists: Boolean(value),
    data: () => value,
    ref: reference(path),
  };
}

function querySnapshot(target: Collection | Query) {
  const prefix = `${target.path}/`;
  const docs = [...mock.documents.keys()]
    .filter((path) => path.startsWith(prefix))
    .filter((path) => !path.slice(prefix.length).includes("/"))
    .filter((path) => {
      if (!("field" in target)) return true;
      return mock.documents.get(path)?.[target.field] === target.value;
    })
    .map(documentSnapshot);
  return { docs };
}

const firestore = {
  collection,
  runTransaction: async <T>(
    operation: (transaction: {
      get: (target: Reference | Collection | Query) => Promise<unknown>;
      update: (target: Reference, value: Record<string, unknown>) => void;
      delete: (target: Reference) => void;
    }) => Promise<T>,
  ) =>
    operation({
      get: async (target) =>
        "collection" in target
          ? documentSnapshot(target.path)
          : querySnapshot(target),
      update: (target, value) =>
        mock.documents.set(target.path, {
          ...mock.documents.get(target.path),
          ...value,
        }),
      delete: (target) => mock.documents.delete(target.path),
    }),
};

vi.mock("@/features/auth/server/require-owner.server", () => ({
  requireOwner: async () => ({ uid: mock.ownerUid }),
}));
vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => firestore,
}));

function seed() {
  const now = Timestamp.now();
  mock.documents.set("projects/subiq", {
    schemaVersion: 1,
    ownerId: "owner-a",
    name: "SubIQ",
    description: "",
    topics: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  });
  for (const id of ["primary", "supporting"]) {
    mock.documents.set(`projects/subiq/keywords/${id}`, {
      schemaVersion: 1,
      keyword: id,
      normalizedKeyword: id,
      countryCode: "US",
      languageCode: "en",
      searchVolume: 100,
      difficulty: 10,
      sourceDiscoveryId: null,
      relevanceOrder: null,
      groupId: "group-1",
      articleId: "article-1",
      createdAt: now,
      updatedAt: now,
    });
  }
  mock.documents.set("projects/subiq/articles/article-1", {
    schemaVersion: 1,
    locale: "en-US",
    keywordId: "primary",
    title: "Cancel a membership",
    slug: "cancel-a-membership",
    topics: ["Memberships"],
    excerpt: null,
    plan: null,
    planReferences: [],
    content: null,
    contentReferences: [],
    seoTitle: null,
    seoDescription: null,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });
  mock.documents.set("projects/subiq/articleSlugs/en-US--cancel-a-membership", {
    articleId: "article-1",
  });
  mock.documents.set("projects/subiq/articles/article-1/translations/vi-VN", {
    articleId: "article-1",
  });
}

describe("deleteArticle", () => {
  beforeEach(() => {
    mock.documents.clear();
    mock.ownerUid = "owner-a";
    seed();
  });

  it("deletes article-owned data and releases every assigned keyword", async () => {
    await deleteArticle("subiq", "article-1");

    expect(mock.documents.has("projects/subiq/articles/article-1")).toBe(false);
    expect(
      mock.documents.has(
        "projects/subiq/articles/article-1/translations/vi-VN",
      ),
    ).toBe(false);
    expect(
      mock.documents.has(
        "projects/subiq/articleSlugs/en-US--cancel-a-membership",
      ),
    ).toBe(false);
    expect(
      mock.documents.get("projects/subiq/keywords/primary")?.articleId,
    ).toBeNull();
    expect(
      mock.documents.get("projects/subiq/keywords/supporting")?.articleId,
    ).toBeNull();
  });

  it("does not delete articles from another owner's project", async () => {
    mock.ownerUid = "owner-b";

    await expect(deleteArticle("subiq", "article-1")).rejects.toThrow(
      "unavailable",
    );
    expect(mock.documents.has("projects/subiq/articles/article-1")).toBe(true);
  });
});
