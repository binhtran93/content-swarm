import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileNavigation } from "./mobile-navigation";

const items = [
  { label: "Home", href: "/", active: true },
  { label: "Support", href: "/support", active: false },
];

describe("MobileNavigation", () => {
  it("reveals every navigation destination from the compact menu", () => {
    render(<MobileNavigation items={items} label="Primary navigation" />);

    const button = screen.getByRole("button", { name: "Primary navigation" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Support" })).toHaveAttribute(
      "href",
      "/support",
    );
  });

  it("closes on Escape and returns focus to the menu button", () => {
    render(<MobileNavigation items={items} label="Primary navigation" />);

    const button = screen.getByRole("button", { name: "Primary navigation" });
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });
});
