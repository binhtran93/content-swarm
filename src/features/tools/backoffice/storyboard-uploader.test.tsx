import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StoryboardUploader } from "@/features/tools/backoffice/storyboard-uploader";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("StoryboardUploader", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

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

  it("uploads the storyboard without hidden CTA text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: "job-1" }),
      }),
    );
    render(
      <StoryboardUploader
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );

    fireEvent.change(screen.getByLabelText("Storyboard image"), {
      target: {
        files: [
          new File(["storyboard"], "storyboard.png", { type: "image/png" }),
        ],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Detect panels" }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const request = vi.mocked(fetch).mock.calls[0]?.[1];
    const body = request?.body as FormData;
    expect(body.has("finalQuestion")).toBe(false);
  });

  it("previews the final CTA without uploading a storyboard", async () => {
    const createObjectUrl = vi.fn(() => "blob:final-cta-preview");
    const revokeObjectUrl = vi.fn();
    class PreviewUrl extends URL {}
    PreviewUrl.createObjectURL = createObjectUrl;
    PreviewUrl.revokeObjectURL = revokeObjectUrl;
    vi.stubGlobal("URL", PreviewUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        blob: async () => new Blob(["png"], { type: "image/png" }),
        ok: true,
      }),
    );

    render(
      <StoryboardUploader
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Preview final CTA" }),
    );

    await waitFor(() =>
      expect(screen.getByAltText("Final CTA preview")).toBeInTheDocument(),
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/admin/projects/urge-zero/tools/storyboard-splitter/final-card-preview",
      {
        method: "POST",
      },
    );
    expect(createObjectUrl).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(revokeObjectUrl).toHaveBeenCalledOnce());
  });
});
