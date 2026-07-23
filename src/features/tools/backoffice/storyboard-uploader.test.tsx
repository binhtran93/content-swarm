import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StoryboardUploader } from "@/features/tools/backoffice/storyboard-uploader";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("StoryboardUploader", () => {
  it("accepts a PNG pasted from the clipboard", () => {
    render(
      <StoryboardUploader
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );

    const image = new File(["storyboard"], "clipboard.png", {
      type: "image/png",
    });
    fireEvent.paste(window, {
      clipboardData: {
        items: [
          {
            getAsFile: () => image,
            kind: "file",
            type: "image/png",
          },
        ],
      },
    });

    const input = screen.getByLabelText("Storyboard image");
    expect((input as HTMLInputElement).files?.[0]?.name).toMatch(
      /^pasted-storyboard-.*\.png$/,
    );
    expect(screen.getByRole("button", { name: "Detect panels" })).toBeEnabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove selected image" }),
    );
    expect((input as HTMLInputElement).files).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: "Detect panels" }),
    ).toBeDisabled();
  });

  it("ignores non-image clipboard content", () => {
    render(
      <StoryboardUploader
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );

    fireEvent.paste(window, {
      clipboardData: {
        items: [
          {
            getAsFile: () => null,
            kind: "string",
            type: "text/plain",
          },
        ],
      },
    });

    expect(
      screen.getByRole("button", { name: "Detect panels" }),
    ).toBeDisabled();
  });
});
