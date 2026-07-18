import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";

const getCookie = vi.fn();
const verifySessionCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: getCookie }),
}));
vi.mock("@/platform/env/server-env", () => ({
  getServerEnv: () => ({ FIREBASE_OWNER_UID: DEPLOYED_OWNER_UID }),
}));
vi.mock("@/platform/firebase/admin-auth.server", () => ({
  getAdminAuth: () => ({ verifySessionCookie }),
}));

describe("requireOwner", () => {
  beforeEach(() => {
    getCookie.mockReset();
    verifySessionCookie.mockReset();
  });

  it("returns the owner after revocation-aware verification", async () => {
    getCookie.mockReturnValue({ value: "valid-cookie" });
    verifySessionCookie.mockResolvedValue({
      uid: DEPLOYED_OWNER_UID,
      email: "owner@example.test",
    });

    await expect(requireOwner()).resolves.toMatchObject({
      uid: DEPLOYED_OWNER_UID,
    });
    expect(verifySessionCookie).toHaveBeenCalledWith("valid-cookie", true);
  });

  it.each([
    ["missing", undefined, undefined],
    ["tampered", { value: "bad-cookie" }, new Error("invalid")],
  ])("fails closed for a %s cookie", async (_name, cookie, error) => {
    getCookie.mockReturnValue(cookie);
    if (error) verifySessionCookie.mockRejectedValue(error);
    await expect(requireOwner()).rejects.toThrow("Owner session required.");
  });

  it("rejects a verified non-owner session", async () => {
    getCookie.mockReturnValue({ value: "valid-cookie" });
    verifySessionCookie.mockResolvedValue({ uid: "another-user" });
    await expect(requireOwner()).rejects.toThrow("Owner session required.");
  });
});
