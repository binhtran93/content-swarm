import { describe, expect, it } from "vitest";

import { getSafeAdminNextPath } from "@/features/auth/server/get-safe-admin-next-path";

describe("getSafeAdminNextPath", () => {
  it("keeps local admin destinations", () => {
    expect(getSafeAdminNextPath("/admin/projects/subiq?tab=articles")).toBe(
      "/admin/projects/subiq?tab=articles",
    );
  });

  it.each([
    undefined,
    "https://example.com/admin",
    "//example.com/admin",
    "/administrator",
    "/login",
  ])("falls back for unsafe destination %s", (destination) => {
    expect(getSafeAdminNextPath(destination)).toBe("/admin/projects");
  });
});
