import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/backoffice/login-form";
import { signInOwner } from "@/features/auth/client/sign-in-owner";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/features/auth/client/sign-in-owner", () => ({
  signInOwner: vi.fn(),
}));

describe("LoginForm", () => {
  it("signs in and returns to the validated admin path", async () => {
    vi.mocked(signInOwner).mockResolvedValueOnce();
    render(<LoginForm nextPath="/admin/projects" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "owner@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(signInOwner).toHaveBeenCalledWith(
        "owner@example.test",
        "password",
      ),
    );
    expect(replace).toHaveBeenCalledWith("/admin/projects");
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("shows one generic failure", async () => {
    vi.mocked(signInOwner).mockRejectedValueOnce(new Error("provider detail"));
    render(<LoginForm nextPath="/admin/projects" />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "person@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to sign in. Check your credentials and try again.",
    );
  });
});
