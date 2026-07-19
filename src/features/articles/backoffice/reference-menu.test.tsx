import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReferenceMenu } from "@/features/articles/backoffice/article-workspace";

const references = [
  { title: "Example source", url: "https://example.com/article" },
];

describe("ReferenceMenu", () => {
  it("closes when the user clicks outside", () => {
    const { container } = render(<ReferenceMenu references={references} />);
    const menu = container.querySelector("details")!;
    menu.open = true;

    fireEvent.pointerDown(document.body);

    expect(menu).not.toHaveAttribute("open");
  });

  it("closes with Escape and returns focus to its trigger", () => {
    const { container } = render(<ReferenceMenu references={references} />);
    const menu = container.querySelector("details")!;
    menu.open = true;

    fireEvent.keyDown(document, { key: "Escape" });

    expect(menu).not.toHaveAttribute("open");
    expect(screen.getByText("Sources 1")).toHaveFocus();
  });
});
