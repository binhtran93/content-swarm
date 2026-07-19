import { beforeEach, describe, expect, it, vi } from "vitest";

import { joinWaitlist } from "@/features/waitlist/server/join-waitlist.server";

const mock = vi.hoisted(() => ({
  acquisition: { mode: "waitlist" } as { mode: "waitlist" | "stores" },
  documents: new Map<string, Record<string, unknown>>(),
  verify: vi.fn(),
}));

function reference(path: string): {
  path: string;
  collection: (name: string) => ReturnType<typeof collection>;
} {
  return {
    path,
    collection: (name) => collection(`${path}/${name}`),
  };
}

function collection(path: string) {
  return { doc: (id: string) => reference(`${path}/${id}`) };
}

const firestore = {
  collection,
  runTransaction: async <T>(
    operation: (transaction: {
      get: (target: { path: string }) => Promise<{ exists: boolean }>;
      create: (
        target: { path: string },
        value: Record<string, unknown>,
      ) => void;
    }) => Promise<T>,
  ) =>
    operation({
      get: async (target) => ({ exists: mock.documents.has(target.path) }),
      create: (target, value) => mock.documents.set(target.path, value),
    }),
};

vi.mock(
  "@/features/projects/public/get-public-project-acquisition.server",
  () => ({ readPublicProjectAcquisition: async () => mock.acquisition }),
);
vi.mock("@/features/waitlist/server/waitlist-env.server", () => ({
  getWaitlistServerEnv: () => ({
    TURNSTILE_SECRET_KEY: "turnstile-secret",
    WAITLIST_EMAIL_HASH_SECRET: "a-secure-test-secret-that-is-long-enough",
  }),
}));
vi.mock("@/features/waitlist/server/verify-turnstile.server", () => ({
  verifyTurnstile: mock.verify,
}));
vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => firestore,
}));

const input = {
  projectId: "subiq",
  email: " Person@Example.com ",
  locale: "en-US",
  source: "hero",
  turnstileToken: "valid-token",
  website: "",
};

describe("joinWaitlist", () => {
  beforeEach(() => {
    mock.documents.clear();
    mock.verify.mockReset();
    mock.verify.mockResolvedValue(true);
    mock.acquisition = { mode: "waitlist" };
  });

  it("stores a normalized project-scoped signup", async () => {
    await expect(joinWaitlist(input)).resolves.toEqual({ ok: true });
    expect(mock.documents.size).toBe(1);
    const [path, document] = [...mock.documents.entries()][0]!;
    expect(path).toMatch(/^projects\/subiq\/waitlistSignups\/[a-f0-9]{64}$/);
    expect(document).toMatchObject({
      schemaVersion: 1,
      email: "person@example.com",
      locale: "en-US",
      source: "hero",
    });
  });

  it("deduplicates repeated email submissions", async () => {
    await joinWaitlist(input);
    await joinWaitlist({ ...input, email: "person@example.com" });
    expect(mock.documents.size).toBe(1);
  });

  it("fails closed when Turnstile rejects the token", async () => {
    mock.verify.mockResolvedValue(false);
    await expect(joinWaitlist(input)).resolves.toMatchObject({ ok: false });
    expect(mock.documents.size).toBe(0);
  });

  it("silently accepts a honeypot submission without writing", async () => {
    await expect(
      joinWaitlist({ ...input, website: "https://spam.example" }),
    ).resolves.toEqual({ ok: true });
    expect(mock.verify).not.toHaveBeenCalled();
    expect(mock.documents.size).toBe(0);
  });

  it("stops accepting signups after store mode is enabled", async () => {
    mock.acquisition = { mode: "stores" };
    await expect(joinWaitlist(input)).resolves.toMatchObject({ ok: false });
    expect(mock.documents.size).toBe(0);
  });
});
