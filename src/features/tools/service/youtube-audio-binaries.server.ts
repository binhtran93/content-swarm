import "server-only";

import { constants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export type YoutubeAudioBinaryPlatform = "darwin-arm64" | "linux-x64";

export function getYoutubeAudioBinaryPlatform(
  platform = process.platform,
  architecture = process.arch,
): YoutubeAudioBinaryPlatform {
  if (platform === "darwin" && architecture === "arm64") {
    return "darwin-arm64";
  }
  if (platform === "linux" && architecture === "x64") {
    return "linux-x64";
  }
  throw new ToolServiceError(
    "disabled",
    "YouTube Audio Extractor supports Apple silicon macOS and x64 Linux.",
  );
}

export function getYoutubeAudioBinaryPaths(
  platform = getYoutubeAudioBinaryPlatform(),
) {
  const directory = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "vendor/media-tools/youtube-audio",
    platform,
  );
  return {
    directory,
    ytDlp: path.join(directory, "yt-dlp"),
    ffmpeg: path.join(directory, "ffmpeg"),
    ffprobe: path.join(directory, "ffprobe"),
    libraryDirectory:
      platform === "linux-x64" ? path.join(directory, "lib") : null,
  };
}

export function getYoutubeAudioExecutionEnvironment(
  binaries = getYoutubeAudioBinaryPaths(),
) {
  if (!binaries.libraryDirectory) return process.env;
  return {
    ...process.env,
    LD_LIBRARY_PATH: [binaries.libraryDirectory, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(path.delimiter),
  };
}

export async function getYoutubeAudioCapability() {
  try {
    const binaries = getYoutubeAudioBinaryPaths();
    await Promise.all([
      access(binaries.ytDlp, constants.X_OK),
      access(binaries.ffmpeg, constants.X_OK),
      access(binaries.ffprobe, constants.X_OK),
      ...(binaries.libraryDirectory
        ? [access(binaries.libraryDirectory, constants.R_OK)]
        : []),
    ]);
    return { available: true, message: null } as const;
  } catch (error) {
    return {
      available: false,
      message:
        error instanceof ToolServiceError
          ? error.message
          : "The bundled YouTube audio tools are unavailable.",
    } as const;
  }
}
