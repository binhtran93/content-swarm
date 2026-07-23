import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { YoutubeAudioExtractor } from "@/features/tools/backoffice/youtube-audio-extractor";

describe("YoutubeAudioExtractor", () => {
  it("extracts one URL and starts the returned download", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          extractionId: "8f6d717d-56d5-4f62-9254-08aeb4d92d31",
          fileName: "example.mp3",
          downloadUrl: "/api/download/example",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    render(
      <YoutubeAudioExtractor
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );

    fireEvent.change(screen.getByLabelText("YouTube video URL"), {
      target: { value: "https://youtu.be/video123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Download MP3" }));

    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/projects/urge-zero/tools/youtube-audio/extractions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ url: "https://youtu.be/video123" }),
      }),
    );
    expect(screen.getByLabelText("YouTube video URL")).toHaveValue("");
  });

  it("shows extraction failures and disables an unavailable tool", async () => {
    const { rerender } = render(
      <YoutubeAudioExtractor
        available
        projectId="urge-zero"
        unavailableMessage={null}
      />,
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Choose a public video." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    fireEvent.change(screen.getByLabelText("YouTube video URL"), {
      target: { value: "https://youtu.be/private" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Download MP3" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose a public video.",
    );

    rerender(
      <YoutubeAudioExtractor
        available={false}
        projectId="urge-zero"
        unavailableMessage="Unsupported platform."
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Unsupported platform.",
    );
    expect(screen.getByRole("button", { name: "Download MP3" })).toBeDisabled();
  });
});
