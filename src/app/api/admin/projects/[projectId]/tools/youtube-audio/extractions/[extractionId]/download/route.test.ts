import { writeFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/admin/projects/[projectId]/tools/youtube-audio/extractions/[extractionId]/download/route";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const mock = vi.hoisted(() => ({
  claimYoutubeAudioDownload: vi.fn(),
}));

vi.mock("@/features/tools/service/youtube-audio.server", () => ({
  claimYoutubeAudioDownload: mock.claimYoutubeAudioDownload,
}));

const extractionId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";

describe("YouTube audio download route", () => {
  it("streams a private attachment with a safe filename", async () => {
    const file = `/tmp/youtube-audio-download-${extractionId}.mp3`;
    await writeFile(file, "audio");
    const cleanup = vi.fn();
    mock.claimYoutubeAudioDownload.mockResolvedValue({
      path: file,
      size: 5,
      fileName: 'unsafe"name\r\n.mp3',
      cleanup,
    });

    const response = await GET(new Request("http://localhost/download"), {
      params: Promise.resolve({ projectId: "urge-zero", extractionId }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    expect(response.headers.get("content-length")).toBe("5");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="unsafe-name--.mp3"',
    );
    expect(Buffer.from(await response.arrayBuffer()).toString()).toBe("audio");
    expect(cleanup).toHaveBeenCalled();
  });

  it("returns not found after a download has been claimed", async () => {
    mock.claimYoutubeAudioDownload.mockRejectedValue(
      new ToolServiceError("not-found", "Already downloaded."),
    );
    const response = await GET(new Request("http://localhost/download"), {
      params: Promise.resolve({ projectId: "urge-zero", extractionId }),
    });
    expect(response.status).toBe(404);
  });
});
