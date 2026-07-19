import { beforeEach, describe, expect, it, vi } from "vitest";

import { removeDiscovery } from "@/features/keywords/service/remove-discovery.server";

const mock = vi.hoisted(() => ({
  exists: true,
  delete: vi.fn(),
  getProjectContext: vi.fn(),
}));

vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: mock.getProjectContext,
}));

vi.mock("@/platform/firebase/firestore.server", () => ({
  getServerFirestore: () => ({
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: mock.exists }),
            delete: mock.delete,
          }),
        }),
      }),
    }),
  }),
}));

describe("removeDiscovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mock.exists = true;
  });

  it("checks project access before deleting the saved discovery", async () => {
    await removeDiscovery("subiq", "discovery-1");

    expect(mock.getProjectContext).toHaveBeenCalledWith("subiq");
    expect(mock.delete).toHaveBeenCalledOnce();
  });

  it("rejects an unavailable discovery", async () => {
    mock.exists = false;

    await expect(removeDiscovery("subiq", "missing")).rejects.toThrow(
      "Discovery is unavailable.",
    );
    expect(mock.delete).not.toHaveBeenCalled();
  });
});
