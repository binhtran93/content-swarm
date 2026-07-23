import { mkdir, rm, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildYoutubeAudioArguments,
  claimYoutubeAudioDownload,
  sweepStaleYoutubeAudioExtractions,
} from "@/features/tools/service/youtube-audio.server";

const mock = vi.hoisted(() => ({
  getProjectContext: vi.fn(),
}));

vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: mock.getProjectContext,
}));

const extractionId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";
let workspace: string;

beforeEach(async () => {
  workspace = await import("node:fs/promises").then(({ mkdtemp }) =>
    mkdtemp(path.join(os.tmpdir(), "youtube-audio-test-")),
  );
  process.env.MEDIA_TOOLS_WORKSPACE_DIR = workspace;
  mock.getProjectContext.mockResolvedValue({ id: "urge-zero" });
});

afterEach(async () => {
  delete process.env.MEDIA_TOOLS_WORKSPACE_DIR;
  await rm(workspace, { recursive: true, force: true });
});

describe("YouTube audio extraction service", () => {
  it("builds a shell-free, single-video, untagged MP3 command", () => {
    const args = buildYoutubeAudioArguments(
      "https://youtu.be/video123",
      "/tmp/output",
      "/vendor/tools",
    );
    expect(args).toEqual(
      expect.arrayContaining([
        "--ignore-config",
        "--no-playlist",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "--no-embed-metadata",
        "--no-embed-thumbnail",
        "--ffmpeg-location",
        "/vendor/tools",
        "--",
        "https://youtu.be/video123",
      ]),
    );
  });

  it("claims a project-scoped download exactly once", async () => {
    const directory = extractionDirectory("urge-zero", extractionId);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "audio.mp3"), "audio");
    await writeFile(
      path.join(directory, "manifest.json"),
      JSON.stringify({
        schemaVersion: 1,
        projectId: "urge-zero",
        extractionId,
        fileName: "Example-video123.mp3",
        createdAt: "2026-07-23T03:00:00.000Z",
      }),
    );

    const download = await claimYoutubeAudioDownload("urge-zero", extractionId);
    expect(download.fileName).toBe("Example-video123.mp3");
    expect(download.size).toBe(5);
    await expect(
      claimYoutubeAudioDownload("urge-zero", extractionId),
    ).rejects.toThrow("already been used");
    await download.cleanup();
  });

  it("enforces owner access before reading local artifacts", async () => {
    mock.getProjectContext.mockRejectedValueOnce(new Error("Not authorized"));
    await expect(
      claimYoutubeAudioDownload("urge-zero", extractionId),
    ).rejects.toThrow("Not authorized");
  });

  it("removes stale UUID directories and ignores unrelated entries", async () => {
    const stale = extractionDirectory("urge-zero", extractionId);
    const unrelated = path.join(
      workspace,
      "projects",
      "urge-zero",
      "youtube-audio",
      "notes",
    );
    await Promise.all([
      mkdir(stale, { recursive: true }),
      mkdir(unrelated, { recursive: true }),
    ]);
    const old = new Date("2026-07-20T00:00:00.000Z");
    await utimes(stale, old, old);

    await sweepStaleYoutubeAudioExtractions(
      "urge-zero",
      new Date("2026-07-23T00:00:00.000Z").getTime(),
    );
    await expect(
      import("node:fs/promises").then(({ access }) => access(stale)),
    ).rejects.toThrow();
    await expect(
      import("node:fs/promises").then(({ access }) => access(unrelated)),
    ).resolves.toBeUndefined();
  });
});

function extractionDirectory(projectId: string, id: string) {
  return path.join(workspace, "projects", projectId, "youtube-audio", id);
}
