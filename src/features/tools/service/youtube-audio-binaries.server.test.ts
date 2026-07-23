import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getYoutubeAudioBinaryPaths,
  getYoutubeAudioBinaryPlatform,
  getYoutubeAudioExecutionEnvironment,
} from "@/features/tools/service/youtube-audio-binaries.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

describe("YouTube audio native binaries", () => {
  it("selects each supported platform", () => {
    expect(getYoutubeAudioBinaryPlatform("darwin", "arm64")).toBe(
      "darwin-arm64",
    );
    expect(getYoutubeAudioBinaryPlatform("linux", "x64")).toBe("linux-x64");
  });

  it("fails closed on unbundled platforms", () => {
    expect(() => getYoutubeAudioBinaryPlatform("darwin", "x64")).toThrow(
      ToolServiceError,
    );
    expect(() => getYoutubeAudioBinaryPlatform("win32", "x64")).toThrow(
      ToolServiceError,
    );
  });

  it("resolves all executables within the selected vendor directory", () => {
    const paths = getYoutubeAudioBinaryPaths("linux-x64");
    expect(paths.ytDlp).toBe(path.join(paths.directory, "yt-dlp"));
    expect(paths.ffmpeg).toBe(path.join(paths.directory, "ffmpeg"));
    expect(paths.ffprobe).toBe(path.join(paths.directory, "ffprobe"));
    expect(paths.libraryDirectory).toBe(path.join(paths.directory, "lib"));
    expect(
      getYoutubeAudioExecutionEnvironment(paths).LD_LIBRARY_PATH,
    ).toContain(paths.libraryDirectory);
  });
});
