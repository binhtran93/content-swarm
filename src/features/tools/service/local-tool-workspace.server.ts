import "server-only";

import { randomUUID } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  storyboardJobIdSchema,
  storyboardJobManifestSchema,
  type StoryboardJobManifest,
  type StoryboardJobSummary,
} from "@/features/tools/model/storyboard-splitter-job";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export function mediaToolsWorkspaceRoot() {
  if (process.env.MEDIA_TOOLS_WORKSPACE_DIR) {
    return path.resolve(
      /*turbopackIgnore: true*/ process.env.MEDIA_TOOLS_WORKSPACE_DIR,
    );
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ".local-tools");
}

export function mediaToolsInstallationRoot() {
  return path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "vendor/media-tools/realesrgan/darwin-arm64",
  );
}

export async function getLocalMediaToolsCapability() {
  const installation = mediaToolsInstallationRoot();
  try {
    await Promise.all([
      access(path.join(installation, "realesrgan-ncnn-vulkan")),
      access(path.join(installation, "models/realesr-animevideov3-x4.param")),
      access(path.join(installation, "models/realesr-animevideov3-x4.bin")),
    ]);
    return { available: true, message: null } as const;
  } catch {
    return {
      available: false,
      message:
        process.platform === "darwin" && process.arch === "arm64"
          ? "The bundled local image enhancer is unavailable."
          : "Storyboard Splitter requires an Apple silicon Mac.",
    } as const;
  }
}

export function storyboardJobDirectory(projectId: string, jobId: string) {
  storyboardJobIdSchema.parse(jobId);
  return resolveWithinWorkspace(
    "projects",
    projectId,
    "storyboard-splitter",
    jobId,
  );
}

export function storyboardJobPath(
  projectId: string,
  jobId: string,
  ...segments: string[]
) {
  const directory = storyboardJobDirectory(projectId, jobId);
  const resolved = path.resolve(directory, ...segments);
  if (
    resolved !== directory &&
    !resolved.startsWith(`${directory}${path.sep}`)
  ) {
    throw new ToolServiceError("invalid", "Local artifact path is invalid.");
  }
  return resolved;
}

export async function createStoryboardJobDirectory(
  projectId: string,
  jobId: string,
) {
  const directory = storyboardJobDirectory(projectId, jobId);
  await mkdir(directory, { recursive: true });
  return directory;
}

export async function writeStoryboardJobManifest(
  manifest: StoryboardJobManifest,
) {
  const validated = storyboardJobManifestSchema.parse(manifest);
  const target = storyboardJobPath(
    validated.projectId,
    validated.jobId,
    "manifest.json",
  );
  const temporary = `${target}.tmp-${randomUUID()}`;
  await writeFile(temporary, `${JSON.stringify(validated, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

export async function readStoryboardJobManifest(
  projectId: string,
  jobId: string,
) {
  try {
    const manifest = storyboardJobManifestSchema.parse(
      JSON.parse(
        await readFile(
          /*turbopackIgnore: true*/ storyboardJobPath(
            projectId,
            jobId,
            "manifest.json",
          ),
          "utf8",
        ),
      ),
    );
    if (manifest.projectId !== projectId || manifest.jobId !== jobId) {
      throw new ToolServiceError("not-found", "Storyboard job is unavailable.");
    }
    return manifest;
  } catch (error) {
    if (error instanceof ToolServiceError) throw error;
    throw new ToolServiceError("not-found", "Storyboard job is unavailable.");
  }
}

export async function listLocalStoryboardJobs(
  projectId: string,
): Promise<StoryboardJobSummary[]> {
  const directory = resolveWithinWorkspace(
    "projects",
    projectId,
    "storyboard-splitter",
  );
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const manifests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        try {
          return await readStoryboardJobManifest(projectId, entry.name);
        } catch {
          return null;
        }
      }),
  );

  return manifests
    .filter((manifest): manifest is StoryboardJobManifest => Boolean(manifest))
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .map(
      ({ jobId, name, status, panelCount, error, createdAt, updatedAt }) => ({
        jobId,
        name,
        status,
        panelCount,
        error,
        createdAt,
        updatedAt,
      }),
    );
}

export async function removeLocalStoryboardJob(
  projectId: string,
  jobId: string,
) {
  await rm(storyboardJobDirectory(projectId, jobId), {
    recursive: true,
    force: false,
  });
}

function resolveWithinWorkspace(...segments: string[]) {
  const root = mediaToolsWorkspaceRoot();
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new ToolServiceError("invalid", "Local artifact path is invalid.");
  }
  return resolved;
}
