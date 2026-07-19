import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminShell } from "@/backoffice/components/layout/admin-shell";
import { PageTitle } from "@/backoffice/components/ui/page-title";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/projects",
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/features/auth/backoffice/sign-out-button", () => ({
  SignOutButton: () => <button type="button">Sign out</button>,
}));

describe("AdminShell", () => {
  it("opens and closes the mobile navigation", () => {
    render(<AdminShell>Content</AdminShell>);
    const sidebar = screen.getByRole("complementary", {
      name: "Admin navigation",
    });
    expect(sidebar).not.toHaveClass("admin-sidebar-open");

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(sidebar).toHaveClass("admin-sidebar-open");
    fireEvent.click(
      screen.getByRole("button", { name: "Close navigation overlay" }),
    );
    expect(sidebar).not.toHaveClass("admin-sidebar-open");
  });

  it("contains the real sign-out action", () => {
    render(<AdminShell>Content</AdminShell>);
    expect(screen.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  it("places page titles and actions in the shared top bar", async () => {
    render(
      <AdminShell>
        <PageTitle
          action={<button type="button">Create</button>}
          title="Articles"
        />
        <div>Content</div>
      </AdminShell>,
    );

    const topbar = screen.getByRole("banner");
    expect(topbar).toContainElement(
      await screen.findByRole("heading", { name: "Articles" }),
    );
    expect(topbar).toContainElement(
      screen.getByRole("button", { name: "Create" }),
    );
  });
});
