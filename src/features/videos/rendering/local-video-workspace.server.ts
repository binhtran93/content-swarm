import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { VideoServiceError } from "@/features/videos/service/video-service-error";

export function videoWorkspaceRoot() {
  return path.resolve(
    process.env.VIDEO_WORKSPACE_DIR ||
      path.join(/*turbopackIgnore: true*/ process.cwd(), ".local-videos"),
  );
}

export function videoRelativeDirectory(projectId: string, videoId: string) {
  return path.join("projects", projectId, "videos", videoId);
}

export function resolveVideoArtifact(relativePath: string) {
  const root = videoWorkspaceRoot();
  const resolved = path.resolve(/*turbopackIgnore: true*/ root, relativePath);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`))
    throw new VideoServiceError("invalid", "Video artifact path is invalid.");
  return resolved;
}

export async function writeVideoArtifact(
  relativePath: string,
  contents: Uint8Array,
) {
  const target = resolveVideoArtifact(relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
  return target;
}

export async function ensureVideoArtifactDirectory(relativePath: string) {
  const target = resolveVideoArtifact(relativePath);
  await mkdir(target, { recursive: true });
  return target;
}

export async function readVideoArtifact(relativePath: string) {
  return readFile(/*turbopackIgnore: true*/ resolveVideoArtifact(relativePath));
}

export function toDataUrl(contentType: string, contents: Uint8Array) {
  return `data:${contentType};base64,${Buffer.from(contents).toString("base64")}`;
}
