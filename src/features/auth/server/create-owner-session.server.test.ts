import { beforeEach, describe, expect, it, vi } from "vitest";

import { createOwnerSession } from "@/features/auth/server/create-owner-session.server";
import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";

const setCookie = vi.fn();
const verifyIdToken = vi.fn();
const createSessionCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: setCookie }),
}));
vi.mock("@/platform/env/server-env", () => ({
  getServerEnv: () => ({ FIREBASE_OWNER_UID: DEPLOYED_OWNER_UID }),
}));
vi.mock("@/platform/firebase/admin-auth.server", () => ({
  getAdminAuth: () => ({ verifyIdToken, createSessionCookie }),
}));

describe("createOwnerSession", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    createSessionCookie.mockReset();
    setCookie.mockReset();
  });

  it("checks revocation and creates a bounded HttpOnly cookie for the owner", async () => {
    verifyIdToken.mockResolvedValue({ uid: DEPLOYED_OWNER_UID });
    createSessionCookie.mockResolvedValue("session-cookie");

    await createOwnerSession("id-token");

    expect(verifyIdToken).toHaveBeenCalledWith("id-token", true);
    expect(setCookie).toHaveBeenCalledWith(
      "__session",
      "session-cookie",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 432_000,
      }),
    );
  });

  it("rejects a valid token belonging to a non-owner", async () => {
    verifyIdToken.mockResolvedValue({ uid: "another-user" });
    await expect(createOwnerSession("id-token")).rejects.toThrow(
      "Unable to create owner session.",
    );
    expect(createSessionCookie).not.toHaveBeenCalled();
  });
});
