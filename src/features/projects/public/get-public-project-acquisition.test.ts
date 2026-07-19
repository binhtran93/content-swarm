import { beforeEach, describe, expect, it, vi } from "vitest";

import { readPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";

const mock = vi.hoisted(() => ({
  exists: true,
  value: {} as Record<string, unknown>,
}));

vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => ({
    collection: () => ({
      doc: () => ({
        get: async () => ({
          exists: mock.exists,
          data: () => mock.value,
        }),
      }),
    }),
  }),
}));

describe("readPublicProjectAcquisition", () => {
  beforeEach(() => {
    mock.exists = true;
    mock.value = {};
  });

  it("defaults legacy and malformed acquisition data to waitlist", async () => {
    await expect(readPublicProjectAcquisition("subiq")).resolves.toEqual({
      mode: "waitlist",
      appStoreUrl: null,
      googlePlayUrl: null,
    });
    mock.value = {
      acquisition: { mode: "stores", appStoreUrl: null, googlePlayUrl: null },
    };
    await expect(readPublicProjectAcquisition("subiq")).resolves.toEqual({
      mode: "waitlist",
      appStoreUrl: null,
      googlePlayUrl: null,
    });
  });

  it("returns a valid partial store launch", async () => {
    mock.value = {
      acquisition: {
        mode: "stores",
        appStoreUrl: "https://apps.apple.com/us/app/subiq/id123",
        googlePlayUrl: null,
      },
    };
    await expect(readPublicProjectAcquisition("subiq")).resolves.toEqual(
      mock.value.acquisition,
    );
  });

  it("rejects missing and unknown public projects", async () => {
    mock.exists = false;
    await expect(readPublicProjectAcquisition("subiq")).rejects.toThrow(
      "unavailable",
    );
    await expect(readPublicProjectAcquisition("skylens")).rejects.toThrow(
      "Unknown public project",
    );
  });
});
