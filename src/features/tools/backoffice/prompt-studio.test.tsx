import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PromptStudio } from "@/features/tools/backoffice/prompt-studio";

const project = {
  name: "UrgeZero",
  description: "Private recovery product context.",
  topics: ["recovery"],
};

describe("PromptStudio", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("builds and copies a Project-aware script prompt", async () => {
    render(<PromptStudio project={project} />);

    expect(
      screen.getByRole("button", { name: "Copy script prompt" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Copy storyboard prompt" }),
    ).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Source story or post"), {
      target: { value: "A multiline story.\nIt has a second line." },
    });

    const prompt = screen.getByLabelText("Full script prompt");
    const promptValue = (prompt as HTMLTextAreaElement).value;
    expect(promptValue).toContain('"name": "UrgeZero"');
    expect(promptValue).toContain(
      '"source": "A multiline story.\\nIt has a second line."',
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy script prompt" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(promptValue));
    expect(screen.getByRole("button", { name: "Copied" })).toBeVisible();
  });

  it("rebuilds the storyboard prompt when the pasted AI response changes", () => {
    render(<PromptStudio project={project} />);
    const response = screen.getByLabelText("AI scene-script response");

    fireEvent.change(response, {
      target: {
        value:
          "SCENE 01\nVOICEOVER: First version.\nON_IMAGE_CAPTION: First\nVISUAL: A first scene.",
      },
    });
    const output = screen.getByLabelText("Full storyboard image prompt");
    expect((output as HTMLTextAreaElement).value).toContain("First version");

    fireEvent.change(response, {
      target: {
        value:
          "SCENE 01\nVOICEOVER: Replacement.\nON_IMAGE_CAPTION: New\nVISUAL: A changed scene.",
      },
    });
    expect((output as HTMLTextAreaElement).value).toContain("Replacement");
    expect((output as HTMLTextAreaElement).value).not.toContain(
      "First version",
    );
  });

  it("reports unavailable clipboard access", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    render(<PromptStudio project={project} />);
    fireEvent.change(screen.getByLabelText("Source story or post"), {
      target: { value: "Source" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Copy script prompt" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Clipboard access is unavailable",
    );
  });
});
