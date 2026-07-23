import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/projects/[projectId]/tools/youtube-audio/extractions/route";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const mock = vi.hoisted(() => ({
  createYoutubeAudioExtraction: vi.fn(),
}));

vi.mock("@/features/tools/service/youtube-audio.server", () => ({
  createYoutubeAudioExtraction: mock.createYoutubeAudioExtraction,
}));

const extractionId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";

describe("YouTube audio extraction route", () => {
  it("returns the one-time Project-scoped download URL", async () => {
    mock.createYoutubeAudioExtraction.mockResolvedValue({
      extractionId,
      fileName: "Example-video123.mp3",
    });
    const response = await POST(
      new Request("http://localhost/api/extractions", {
        method: "POST",
        body: JSON.stringify({ url: "https://youtu.be/video123" }),
      }),
      { params: Promise.resolve({ projectId: "urge-zero" }) },
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      extractionId,
      fileName: "Example-video123.mp3",
      downloadUrl: `/api/admin/projects/urge-zero/tools/youtube-audio/extractions/${extractionId}/download`,
    });
    expect(mock.createYoutubeAudioExtraction).toHaveBeenCalledWith(
      "urge-zero",
      "https://youtu.be/video123",
    );
  });

  it("maps unavailable native tools to a service-unavailable response", async () => {
    mock.createYoutubeAudioExtraction.mockRejectedValue(
      new ToolServiceError("disabled", "Unsupported platform."),
    );
    const response = await POST(
      new Request("http://localhost/api/extractions", {
        method: "POST",
        body: JSON.stringify({ url: "https://youtu.be/video123" }),
      }),
      { params: Promise.resolve({ projectId: "urge-zero" }) },
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Unsupported platform.",
    });
  });
});
