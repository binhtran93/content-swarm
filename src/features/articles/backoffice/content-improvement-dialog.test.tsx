import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { ContentImprovementDialog } from "@/features/articles/backoffice/content-improvement-dialog";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

describe("ContentImprovementDialog", () => {
  const changes = [
    { before: "Formal original.", after: "Natural replacement." },
    { before: "Repeated phrase.", after: "Concise phrase." },
  ];

  it("starts unchecked and applies only selected changes", () => {
    const apply = vi.fn();

    render(
      <ContentImprovementDialog
        applying={false}
        changes={changes}
        onApply={apply}
        onDismiss={vi.fn()}
      />,
    );

    const applyButton = screen.getByRole("button", {
      name: "Apply selected changes",
    });
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(applyButton).toBeDisabled();

    fireEvent.click(checkboxes[1]!);
    fireEvent.click(applyButton);

    expect(apply).toHaveBeenCalledWith([changes[1]]);
  });

  it("supports selecting and clearing every proposal", () => {
    render(
      <ContentImprovementDialog
        applying={false}
        changes={changes}
        onApply={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    screen
      .getAllByRole("checkbox")
      .forEach((checkbox) => expect(checkbox).toBeChecked());

    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    screen
      .getAllByRole("checkbox")
      .forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it("discards the review when cancelled", () => {
    const dismiss = vi.fn();

    render(
      <ContentImprovementDialog
        applying={false}
        changes={changes}
        onApply={vi.fn()}
        onDismiss={dismiss}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(dismiss).toHaveBeenCalledOnce();
  });

  it("shows an empty review state", () => {
    render(
      <ContentImprovementDialog
        applying={false}
        changes={[]}
        onApply={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(screen.getByText("No meaningful changes found")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Apply selected changes" }),
    ).toBeDisabled();
  });
});
