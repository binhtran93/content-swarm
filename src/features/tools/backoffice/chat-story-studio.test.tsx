import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChatStoryStudio } from "@/features/tools/backoffice/chat-story-studio";

vi.mock("@remotion/player", () => ({
  Player: () => <div data-testid="remotion-player" />,
}));

const project = {
  name: "UrgeZero",
  description: "Private context",
  topics: ["recovery"],
};

function validResponse() {
  return JSON.stringify({
    version: 1,
    title: "The last text",
    participants: [
      { id: "left", displayName: "Maya" },
      { id: "right", displayName: "Noah" },
    ],
    messages: Array.from({ length: 20 }, (_, index) => ({
      id: `m${index + 1}`,
      senderId: index % 2 ? "right" : "left",
      text: `Message ${index + 1}`,
      waitMs: 500,
      typingMs: 1_500,
      sound: index === 18 ? "reveal" : index % 2 ? "outgoing" : "incoming",
    })),
  });
}

describe("ChatStoryStudio", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("keeps the seed input prominent and builds a copyable prompt", async () => {
    render(<ChatStoryStudio project={project} projectId="urge-zero" />);

    fireEvent.change(screen.getByLabelText("Story seed"), {
      target: { value: "A message arrives after a funeral." },
    });

    expect(
      screen.queryByLabelText("Full chat story prompt"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View prompt" }));

    const dialog = screen.getByRole("dialog");
    const prompt = within(dialog).getByLabelText(
      "Full chat story prompt",
    ) as HTMLTextAreaElement;
    expect(prompt.value).toContain("A message arrives after a funeral.");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Copy prompt" }),
    );
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(prompt.value));
    expect(
      within(dialog).getByRole("button", { name: "Copied" }),
    ).toBeVisible();

    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(
      screen.queryByLabelText("Full chat story prompt"),
    ).not.toBeInTheDocument();
  });

  it("validates pasted JSON and unlocks preview and export", async () => {
    render(<ChatStoryStudio project={project} projectId="urge-zero" />);
    expect(screen.getByRole("button", { name: "Export MP4" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("ChatGPT JSON response"), {
      target: { value: validResponse() },
    });

    expect(await screen.findByText(/Ready: 20 messages/)).toBeVisible();
    expect(screen.getByTestId("remotion-player")).toBeVisible();
    expect(screen.getByRole("button", { name: "Export MP4" })).toBeEnabled();
  });

  it("shows a useful error when repaired JSON has the wrong structure", async () => {
    render(<ChatStoryStudio project={project} projectId="urge-zero" />);
    fireEvent.change(screen.getByLabelText("ChatGPT JSON response"), {
      target: { value: "```json\n{}\n```" },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("title");
  });
});
