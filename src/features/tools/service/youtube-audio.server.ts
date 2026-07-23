import "server-only";

import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { z } from "zod";

import {
  youtubeAudioExtractionIdSchema,
  youtubeAudioUrlSchema,
} from "@/features/tools/model/youtube-audio";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { mediaToolsWorkspaceRoot } from "@/features/tools/service/local-tool-workspace.server";
import {
  getYoutubeAudioBinaryPaths,
  getYoutubeAudioCapability,
  getYoutubeAudioExecutionEnvironment,
} from "@/features/tools/service/youtube-audio-binaries.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const executeFile = promisify(execFile);
const staleExtractionAgeMs = 24 * 60 * 60 * 1_000;
const activeExtractions = new Set<string>();

const extractionManifestSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  extractionId: youtubeAudioExtractionIdSchema,
  fileName: z.string().min(1).max(255),
  createdAt: z.iso.datetime(),
});

type ExtractionManifest = z.infer<typeof extractionManifestSchema>;

export async function createYoutubeAudioExtraction(
  projectId: string,
  inputUrl: string,
) {
  await getProjectContext(projectId);
  const url = youtubeAudioUrlSchema.parse(inputUrl);
  const capability = await getYoutubeAudioCapability();
  if (!capability.available) {
    throw new ToolServiceError("disabled", capability.message);
  }

  await sweepStaleYoutubeAudioExtractions(projectId);
  const extractionId = randomUUID();
  const directory = youtubeAudioExtractionDirectory(projectId, extractionId);
  activeExtractions.add(directory);
  await mkdir(directory, { recursive: true });

  try {
    const binaries = getYoutubeAudioBinaryPaths();
    await executeFile(
      binaries.ytDlp,
      buildYoutubeAudioArguments(url, directory, binaries.directory),
      {
        cwd: directory,
        encoding: "utf8",
        env: getYoutubeAudioExecutionEnvironment(binaries),
        maxBuffer: 1024 * 1024,
      },
    );

    const outputs = (await readdir(directory)).filter((entry) =>
      entry.toLowerCase().endsWith(".mp3"),
    );
    if (outputs.length !== 1) {
      throw new ToolServiceError(
        "failed",
        "YouTube did not return an audio file for this video.",
      );
    }

    const sourceName = outputs[0];
    const fileName = sanitizeDownloadFileName(sourceName);
    const sourcePath = resolveWithinExtraction(directory, sourceName);
    const audioPath = resolveWithinExtraction(directory, "audio.mp3");
    if (sourcePath !== audioPath) await rename(sourcePath, audioPath);

    const manifest: ExtractionManifest = {
      schemaVersion: 1,
      projectId,
      extractionId,
      fileName,
      createdAt: new Date().toISOString(),
    };
    await writeFile(
      resolveWithinExtraction(directory, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8",
    );
    return manifest;
  } catch (error) {
    await rm(directory, { recursive: true, force: true }).catch(
      () => undefined,
    );
    if (error instanceof ToolServiceError) throw error;
    throw mapYoutubeAudioFailure(error);
  } finally {
    activeExtractions.delete(directory);
  }
}

export async function claimYoutubeAudioDownload(
  projectId: string,
  extractionId: string,
) {
  await getProjectContext(projectId);
  youtubeAudioExtractionIdSchema.parse(extractionId);
  const directory = youtubeAudioExtractionDirectory(projectId, extractionId);
  const manifest = await readExtractionManifest(
    projectId,
    extractionId,
    directory,
  );
  const source = resolveWithinExtraction(directory, "audio.mp3");
  const claimed = resolveWithinExtraction(directory, "claimed.mp3");
  try {
    await rename(source, claimed);
    const metadata = await stat(claimed);
    return {
      path: claimed,
      size: metadata.size,
      fileName: manifest.fileName,
      cleanup: () =>
        rm(directory, { recursive: true, force: true }).catch(() => undefined),
    };
  } catch {
    throw new ToolServiceError(
      "not-found",
      "This audio download is unavailable or has already been used.",
    );
  }
}

export function buildYoutubeAudioArguments(
  url: string,
  outputDirectory: string,
  ffmpegDirectory: string,
) {
  return [
    "--ignore-config",
    "--no-playlist",
    "--format",
    "bestaudio",
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--no-embed-metadata",
    "--no-embed-thumbnail",
    "--no-write-thumbnail",
    "--restrict-filenames",
    "--ffmpeg-location",
    ffmpegDirectory,
    "--paths",
    outputDirectory,
    "--output",
    "%(title).120B-%(id)s.%(ext)s",
    "--",
    url,
  ];
}

export async function sweepStaleYoutubeAudioExtractions(
  projectId: string,
  now = Date.now(),
) {
  const root = youtubeAudioProjectDirectory(projectId);
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return;
  }
  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const parsedId = youtubeAudioExtractionIdSchema.safeParse(entry.name);
        if (!parsedId.success) return;
        const directory = youtubeAudioExtractionDirectory(
          projectId,
          entry.name,
        );
        if (activeExtractions.has(directory)) return;
        try {
          const metadata = await stat(directory);
          if (now - metadata.mtimeMs > staleExtractionAgeMs) {
            await rm(directory, { recursive: true, force: true });
          }
        } catch {
          // Another request may already have claimed or removed this extraction.
        }
      }),
  );
}

function youtubeAudioProjectDirectory(projectId: string) {
  return resolveWithinWorkspace("projects", projectId, "youtube-audio");
}

function youtubeAudioExtractionDirectory(
  projectId: string,
  extractionId: string,
) {
  youtubeAudioExtractionIdSchema.parse(extractionId);
  return resolveWithinWorkspace(
    "projects",
    projectId,
    "youtube-audio",
    extractionId,
  );
}

function resolveWithinWorkspace(...segments: string[]) {
  const root = mediaToolsWorkspaceRoot();
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new ToolServiceError("invalid", "Local artifact path is invalid.");
  }
  return resolved;
}

function resolveWithinExtraction(directory: string, fileName: string) {
  const resolved = path.resolve(directory, fileName);
  if (!resolved.startsWith(`${directory}${path.sep}`)) {
    throw new ToolServiceError("invalid", "Local artifact path is invalid.");
  }
  return resolved;
}

async function readExtractionManifest(
  projectId: string,
  extractionId: string,
  directory: string,
) {
  try {
    const manifest = extractionManifestSchema.parse(
      JSON.parse(
        await readFile(
          resolveWithinExtraction(directory, "manifest.json"),
          "utf8",
        ),
      ),
    );
    if (
      manifest.projectId !== projectId ||
      manifest.extractionId !== extractionId
    ) {
      throw new Error("Mismatched extraction");
    }
    await access(resolveWithinExtraction(directory, "audio.mp3"));
    return manifest;
  } catch {
    throw new ToolServiceError(
      "not-found",
      "This audio download is unavailable or has already been used.",
    );
  }
}

function sanitizeDownloadFileName(value: string) {
  const sanitized = path
    .basename(value)
    .replace(/[\u0000-\u001f\u007f"\\]/g, "-")
    .slice(0, 250);
  return sanitized.toLowerCase().endsWith(".mp3")
    ? sanitized
    : `${sanitized}.mp3`;
}

function mapYoutubeAudioFailure(error: unknown) {
  const message =
    error && typeof error === "object" && "stderr" in error
      ? String(error.stderr)
      : "";
  if (
    /private|members[- ]only|sign in|login|age[- ]restricted|unavailable/i.test(
      message,
    )
  ) {
    return new ToolServiceError(
      "invalid",
      "This video is unavailable without authentication. Choose a public video.",
    );
  }
  return new ToolServiceError(
    "failed",
    "The YouTube audio could not be extracted.",
  );
}
