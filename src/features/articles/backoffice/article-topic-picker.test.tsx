import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleTopicPicker } from "@/features/articles/backoffice/article-topic-picker";

describe("ArticleTopicPicker", () => {
  it("combines configured selections with free-text topics", () => {
    const { container } = render(
      <form>
        <ArticleTopicPicker
          initialTopics={["Memberships"]}
          options={["Memberships", "Billing", "Gyms"]}
        />
      </form>,
    );
    const input = screen.getByRole("textbox", { name: "Add topic" });

    fireEvent.focus(input);
    fireEvent.click(screen.getByRole("button", { name: "Billing" }));
    fireEvent.change(input, { target: { value: "Cancellation" } });
    fireEvent.keyDown(input, { key: "Enter" });

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    expect(new FormData(form!).getAll("topics")).toEqual([
      "Memberships",
      "Billing",
      "Cancellation",
      "",
    ]);
  });

  it("removes selected topics", () => {
    const { container } = render(
      <form>
        <ArticleTopicPicker
          initialTopics={["Memberships", "Billing"]}
          options={[]}
        />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove Billing" }));

    const form = container.querySelector("form");
    expect(new FormData(form!).getAll("topics")).toEqual(["Memberships", ""]);
  });
});
