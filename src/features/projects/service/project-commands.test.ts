import { Timestamp } from "firebase-admin/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultProjectAcquisition } from "@/features/projects/model/project-acquisition";
import { appendProjectCompetitor } from "@/features/projects/service/append-project-competitor.server";
import { archiveProject } from "@/features/projects/service/archive-project.server";
import { createProject } from "@/features/projects/service/create-project.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getProject } from "@/features/projects/service/get-project.server";
import { listActiveProjects } from "@/features/projects/service/list-active-projects.server";
import { updateProject } from "@/features/projects/service/update-project.server";

const mock = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
  ownerUid: "owner-a",
  requireOwner: vi.fn(),
}));

function snapshot(path: string) {
  const value = mock.documents.get(path);
  return {
    id: path.split("/").at(-1),
    exists: Boolean(value),
    data: () => value,
    ref: { path },
  };
}

function reference(path: string) {
  return {
    id: path.split("/").at(-1),
    path,
    get: async () => snapshot(path),
  };
}

const firestore = {
  collection: (collectionPath: string) => ({
    doc: (id: string) => reference(`${collectionPath}/${id}`),
    where: (_field: string, _operation: string, ownerId: string) => ({
      orderBy: () => ({
        get: async () => ({
          docs: [...mock.documents.entries()]
            .filter(
              ([path, document]) =>
                path.startsWith(`${collectionPath}/`) &&
                document.ownerId === ownerId,
            )
            .sort(
              ([, left], [, right]) =>
                (right.updatedAt as Timestamp).toMillis() -
                (left.updatedAt as Timestamp).toMillis(),
            )
            .map(([path]) => snapshot(path)),
        }),
      }),
    }),
  }),
  runTransaction: async <T>(
    operation: (transaction: {
      get: (target: { path: string }) => Promise<ReturnType<typeof snapshot>>;
      create: (
        target: { path: string },
        value: Record<string, unknown>,
      ) => void;
      set: (target: { path: string }, value: Record<string, unknown>) => void;
    }) => Promise<T>,
  ) =>
    operation({
      get: async (target) => snapshot(target.path),
      create: (target, value) => mock.documents.set(target.path, value),
      set: (target, value) => mock.documents.set(target.path, value),
    }),
};

vi.mock("@/features/auth/server/require-owner.server", () => ({
  requireOwner: mock.requireOwner,
}));
vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => firestore,
}));

const baseInput = {
  projectId: "subiq",
  name: "SubIQ",
  description: "Subscription intelligence for growing software teams.",
};

describe("Project commands and queries", () => {
  beforeEach(() => {
    mock.documents.clear();
    mock.ownerUid = "owner-a";
    mock.requireOwner.mockReset();
    mock.requireOwner.mockImplementation(async () => ({ uid: mock.ownerUid }));
  });

  it("assigns ownerId from the verified session and persists creation", async () => {
    await createProject({
      ...baseInput,
      ownerId: "attacker",
    } as typeof baseInput);

    expect(mock.documents.get("projects/subiq")).toMatchObject({
      ownerId: "owner-a",
      schemaVersion: 1,
      status: "active",
      acquisition: defaultProjectAcquisition,
      competitorDomains: [],
    });
    expect(mock.requireOwner).toHaveBeenCalledOnce();
  });

  it("does not overwrite an existing stable project ID", async () => {
    await createProject(baseInput);
    await expect(createProject(baseInput)).rejects.toThrow(
      "project ID is already in use",
    );
  });

  it("rejects crafted reads and writes across owners", async () => {
    await createProject(baseInput);
    mock.ownerUid = "owner-b";

    await expect(getProject("subiq")).rejects.toThrow("unavailable");
    await expect(
      updateProject("subiq", {
        name: "Stolen",
        description: baseInput.description,
        voiceTone: "",
        topics: [],
        competitorDomains: [],
        acquisition: defaultProjectAcquisition,
      }),
    ).rejects.toThrow("unavailable");
    await expect(archiveProject("subiq")).rejects.toThrow("unavailable");
  });

  it("updates mutable fields but preserves owner and identity", async () => {
    await createProject(baseInput);
    const updated = await updateProject("subiq", {
      name: "SubIQ Pro",
      description: "Updated private product context.",
      voiceTone: "Direct and practical.",
      topics: ["SaaS", "Retention"],
      competitorDomains: ["https://Competitor.com/pricing"],
      acquisition: defaultProjectAcquisition,
    });

    expect(updated).toMatchObject({
      projectId: "subiq",
      name: "SubIQ Pro",
      voiceTone: "Direct and practical.",
      topics: ["SaaS", "Retention"],
      competitorDomains: ["competitor.com"],
      acquisition: defaultProjectAcquisition,
    });
    expect(mock.documents.get("projects/subiq")?.ownerId).toBe("owner-a");
  });

  it("appends one normalized competitor without duplicating it", async () => {
    await createProject(baseInput);

    await appendProjectCompetitor(
      "subiq",
      "https://Competitor.com/pricing?source=research",
    );
    await appendProjectCompetitor("subiq", "competitor.com");

    expect(mock.documents.get("projects/subiq")?.competitorDomains).toEqual([
      "competitor.com",
    ]);
  });

  it("does not append competitors for foreign or archived projects", async () => {
    await createProject(baseInput);
    mock.ownerUid = "owner-b";
    await expect(
      appendProjectCompetitor("subiq", "competitor.com"),
    ).rejects.toThrow("unavailable");

    mock.ownerUid = "owner-a";
    await archiveProject("subiq");
    await expect(
      appendProjectCompetitor("subiq", "competitor.com"),
    ).rejects.toThrow("cannot be changed");
    expect(mock.documents.get("projects/subiq")?.competitorDomains).toEqual([]);
  });

  it("lists only active owned projects in recent-first order", async () => {
    await createProject(baseInput);
    await createProject({
      ...baseInput,
      projectId: "skylens",
      name: "SkyLens",
    });
    await archiveProject("subiq");

    await expect(listActiveProjects()).resolves.toEqual([
      expect.objectContaining({ projectId: "skylens", status: "active" }),
    ]);
  });

  it("keeps archived projects readable but blocks downstream context", async () => {
    await createProject(baseInput);
    await archiveProject("subiq");

    await expect(getProject("subiq")).resolves.toMatchObject({
      status: "archived",
    });
    await expect(getProjectContext("subiq")).rejects.toThrow(
      "cannot start new work",
    );
    await expect(
      updateProject("subiq", {
        name: "No change",
        description: baseInput.description,
        voiceTone: "",
        topics: [],
        competitorDomains: [],
        acquisition: defaultProjectAcquisition,
      }),
    ).rejects.toThrow("cannot be changed");
  });
});
