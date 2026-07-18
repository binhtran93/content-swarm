import { beforeEach, describe, expect, it, vi } from "vitest";

import { signOutOwner } from "@/features/auth/client/sign-out-owner";

const { auth, firebaseSignOut } = vi.hoisted(() => ({
  auth: { currentUser: { uid: "owner" } },
  firebaseSignOut: vi.fn(),
}));

vi.mock("firebase/auth", () => ({ signOut: firebaseSignOut }));
vi.mock("@/features/auth/client/get-client-auth", () => ({
  getClientAuth: () => auth,
}));

describe("signOutOwner", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));
    firebaseSignOut.mockResolvedValue(undefined);
  });

  it("clears both the server session and Firebase client session", async () => {
    await signOutOwner();
    expect(fetch).toHaveBeenCalledWith("/api/auth/session", {
      method: "DELETE",
    });
    expect(firebaseSignOut).toHaveBeenCalledWith(auth);
  });
});
