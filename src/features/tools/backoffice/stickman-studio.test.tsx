import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StickmanStudio } from "@/features/tools/backoffice/stickman-studio";

const project = {
  projectId: "urge-zero",
  name: "UrgeZero",
  description: "Private recovery product context.",
  voiceTone: "Direct, compassionate, and candid.",
  topics: ["recovery"],
};

describe("StickmanStudio", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    window.localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("builds and copies a Project-aware script prompt", async () => {
    render(<StickmanStudio project={project} />);

    expect(screen.getByText(/faithful captions and visuals/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Copy JSON prompt" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Copy storyboard prompt" }),
    ).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Source story or post"), {
      target: { value: "A multiline story.\nIt has a second line." },
    });

    const prompt = screen.getByLabelText("Full JSON-generation prompt");
    const promptValue = (prompt as HTMLTextAreaElement).value;
    expect(promptValue).toContain('"name": "UrgeZero"');
    expect(promptValue).toContain(
      '"voiceTone": "Direct, compassionate, and candid."',
    );
    expect(promptValue).toContain(
      '"source": "A multiline story.\\nIt has a second line."',
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy JSON prompt" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(promptValue));
    expect(screen.getByRole("button", { name: "Copied" })).toBeVisible();
  });

  it("rebuilds the storyboard prompt when the pasted AI response changes", () => {
    render(<StickmanStudio project={project} />);
    const response = screen.getByLabelText("AI JSON response");

    fireEvent.change(response, {
      target: {
        value: JSON.stringify({
          scenes: [{ scene: 1, caption: "First", visual: "A first scene" }],
        }),
      },
    });
    const output = screen.getByLabelText("Full storyboard image prompt");
    expect((output as HTMLTextAreaElement).value).toContain("A first scene");
    fireEvent.change(response, {
      target: {
        value: JSON.stringify({
          scenes: [{ scene: 1, caption: "New", visual: "A changed scene" }],
        }),
      },
    });
    expect((output as HTMLTextAreaElement).value).toContain("A changed scene");
    expect((output as HTMLTextAreaElement).value).not.toContain(
      "A first scene",
    );
  });

  it("rejects a non-JSON AI response without building the image prompt", () => {
    render(<StickmanStudio project={project} />);

    fireEvent.change(screen.getByLabelText("AI JSON response"), {
      target: { value: "SCENE 01\nCAPTION: Not JSON" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Paste the complete JSON code block",
    );
    expect(
      screen.getByRole("button", { name: "Copy storyboard prompt" }),
    ).toBeDisabled();
  });

  it("reports unavailable clipboard access", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    render(<StickmanStudio project={project} />);
    fireEvent.change(screen.getByLabelText("Source story or post"), {
      target: { value: "Source" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Copy JSON prompt" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Clipboard access is unavailable",
    );
  });
});
