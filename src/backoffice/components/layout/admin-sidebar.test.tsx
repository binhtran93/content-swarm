import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminSidebar } from "@/backoffice/components/layout/admin-sidebar";

let pathname = "/admin/projects";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));
vi.mock("@/features/auth/backoffice/sign-out-button", () => ({
  SignOutButton: ({ className }: { className?: string }) => (
    <button className={className} type="button">
      Sign out
    </button>
  ),
}));

describe("AdminSidebar", () => {
  beforeEach(() => {
    pathname = "/admin/projects";
  });

  it("marks the current route and exposes project navigation only in context", () => {
    const { rerender } = render(
      <AdminSidebar onClose={vi.fn()} open={false} />,
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("link", { name: "Keywords" })).toBeNull();

    pathname = "/admin/projects/subiq/keywords";
    rerender(<AdminSidebar onClose={vi.fn()} open={false} projectId="subiq" />);
    expect(screen.getByRole("link", { name: "Keywords" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("closes the mobile drawer with Escape", () => {
    const onClose = vi.fn();
    render(<AdminSidebar onClose={onClose} open />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows account controls in the sidebar footer", () => {
    render(
      <AdminSidebar
        onClose={vi.fn()}
        open={false}
        ownerEmail="owner@example.com"
      />,
    );

    expect(screen.getByText("owner@example.com")).toBeVisible();
    expect(screen.getByRole("button", { name: "Sign out" })).toHaveClass(
      "justify-start",
    );
  });
});
