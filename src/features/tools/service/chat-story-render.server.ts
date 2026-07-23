import "server-only";

import { bundle } from "@remotion/bundler";
import {
  makeCancelSignal,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import {
  chatStoryScriptSchema,
  type ChatStoryScript,
} from "@/features/tools/model/chat-story";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { mediaToolsWorkspaceRoot } from "@/features/tools/service/local-tool-workspace.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const staleRenderAgeMs = 24 * 60 * 60 * 1_000;
const renderJobIdSchema = z.uuid();
const renderStatusSchema = z.enum([
  "queued",
  "rendering",
  "completed",
  "failed",
  "cancelled",
]);
const renderManifestSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  jobId: renderJobIdSchema,
  status: renderStatusSchema,
  progress: z.number().min(0).max(1),
  error: z.string().nullable(),
  fileName: z.string().min(1).max(180).nullable(),
  script: chatStoryScriptSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

type RenderManifest = z.infer<typeof renderManifestSchema>;
export type ChatStoryRenderSummary = Pick<
  RenderManifest,
  "jobId" | "status" | "progress" | "error" | "fileName"
>;

const activeProjects = new Set<string>();
const cancellations = new Map<string, () => void>();
const liveProgress = new Map<string, number>();
let bundlePromise: Promise<string> | null = null;

export async function createChatStoryRender(projectId: string, input: unknown) {
  await getProjectContext(projectId);
  const script = chatStoryScriptSchema.parse(input);
  if (activeProjects.has(projectId)) {
    throw new ToolServiceError(
      "processing",
      "This Project already has a video rendering.",
    );
  }

  await sweepStaleChatStoryRenders(projectId);
  const now = new Date().toISOString();
  const manifest: RenderManifest = {
    schemaVersion: 1,
    projectId,
    jobId: randomUUID(),
    status: "queued",
    progress: 0,
    error: null,
    fileName: null,
    script,
    createdAt: now,
    updatedAt: now,
  };
  await mkdir(renderDirectory(projectId, manifest.jobId), { recursive: true });
  await writeManifest(manifest);
  return summarize(manifest);
}

export async function processChatStoryRender(projectId: string, jobId: string) {
  await getProjectContext(projectId);
  const initial = await readManifest(projectId, jobId);
  if (initial.status !== "queued") {
    if (initial.status === "completed") return summarize(initial);
    throw new ToolServiceError(
      "processing",
      "This render has already been started.",
    );
  }
  if (activeProjects.has(projectId)) {
    throw new ToolServiceError(
      "processing",
      "This Project already has a video rendering.",
    );
  }

  activeProjects.add(projectId);
  const cancellation = makeCancelSignal();
  cancellations.set(renderKey(projectId, jobId), cancellation.cancel);
  liveProgress.set(renderKey(projectId, jobId), 0.01);
  let manifest = await updateManifest(initial, {
    status: "rendering",
    progress: 0.01,
    error: null,
  });
  const output = renderPath(projectId, jobId);

  try {
    const serveUrl = await getChatStoryBundle((progress) => {
      liveProgress.set(renderKey(projectId, jobId), 0.02 + progress * 0.08);
    });
    const composition = await selectComposition({
      serveUrl,
      id: "ChatStory",
      inputProps: { script: manifest.script },
      logLevel: "warn",
    });
    await renderMedia({
      serveUrl,
      composition,
      inputProps: { script: manifest.script },
      outputLocation: output,
      codec: "h264",
      audioCodec: "aac",
      pixelFormat: "yuv420p",
      x264Preset: "fast",
      imageFormat: "jpeg",
      jpegQuality: 92,
      overwrite: true,
      cancelSignal: cancellation.cancelSignal,
      logLevel: "warn",
      onProgress: ({ progress }) => {
        liveProgress.set(
          renderKey(projectId, jobId),
          Math.min(0.99, 0.1 + progress * 0.9),
        );
      },
    });

    manifest = await readManifest(projectId, jobId);
    if (manifest.status === "cancelled") {
      await rm(output, { force: true });
      return summarize(manifest);
    }
    manifest = await updateManifest(manifest, {
      status: "completed",
      progress: 1,
      fileName: buildFileName(manifest.script),
    });
    return summarize(manifest);
  } catch {
    await rm(output, { force: true }).catch(() => undefined);
    manifest = await readManifest(projectId, jobId).catch(() => manifest);
    if (manifest.status === "cancelled") return summarize(manifest);
    manifest = await updateManifest(manifest, {
      status: "failed",
      error: "The chat video could not be rendered.",
    });
    throw new ToolServiceError(
      "failed",
      manifest.error ?? "The chat video could not be rendered.",
    );
  } finally {
    activeProjects.delete(projectId);
    cancellations.delete(renderKey(projectId, jobId));
    liveProgress.delete(renderKey(projectId, jobId));
  }
}

export async function getChatStoryRender(projectId: string, jobId: string) {
  await getProjectContext(projectId);
  const manifest = await readManifest(projectId, jobId);
  const summary = summarize(manifest);
  if (manifest.status === "rendering") {
    summary.progress = Math.max(
      summary.progress,
      liveProgress.get(renderKey(projectId, jobId)) ?? 0,
    );
  }
  return summary;
}

export async function cancelChatStoryRender(projectId: string, jobId: string) {
  await getProjectContext(projectId);
  const manifest = await readManifest(projectId, jobId);
  if (manifest.status !== "queued" && manifest.status !== "rendering") {
    return summarize(manifest);
  }
  cancellations.get(renderKey(projectId, jobId))?.();
  liveProgress.delete(renderKey(projectId, jobId));
  const cancelled = await updateManifest(manifest, {
    status: "cancelled",
    error: null,
  });
  await rm(renderPath(projectId, jobId), { force: true }).catch(
    () => undefined,
  );
  return summarize(cancelled);
}

export async function getChatStoryVideo(projectId: string, jobId: string) {
  await getProjectContext(projectId);
  const manifest = await readManifest(projectId, jobId);
  if (manifest.status !== "completed" || !manifest.fileName) {
    throw new ToolServiceError("not-found", "The video is unavailable.");
  }
  try {
    const file = renderPath(projectId, jobId);
    const metadata = await stat(file);
    return {
      path: file,
      size: metadata.size,
      fileName: manifest.fileName,
    };
  } catch {
    throw new ToolServiceError("not-found", "The video is unavailable.");
  }
}

export async function sweepStaleChatStoryRenders(
  projectId: string,
  now = Date.now(),
) {
  const root = renderProjectDirectory(projectId);
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
        if (!renderJobIdSchema.safeParse(entry.name).success) return;
        const directory = renderDirectory(projectId, entry.name);
        if (cancellations.has(renderKey(projectId, entry.name))) return;
        try {
          const metadata = await stat(directory);
          if (now - metadata.mtimeMs > staleRenderAgeMs) {
            await rm(directory, { recursive: true, force: true });
          }
        } catch {
          // Another request may already have removed this render.
        }
      }),
  );
}

function summarize(manifest: RenderManifest): ChatStoryRenderSummary {
  const { jobId, status, progress, error, fileName } = manifest;
  return { jobId, status, progress, error, fileName };
}

async function getChatStoryBundle(onProgress: (progress: number) => void) {
  if (!bundlePromise) {
    const entryPoint = path.join(
      process.cwd(),
      "src/features/tools/video/remotion-entry.tsx",
    );
    bundlePromise = bundle({
      entryPoint,
      onProgress,
      webpackOverride: (configuration) => ({
        ...configuration,
        resolve: {
          ...configuration.resolve,
          alias: {
            ...(configuration.resolve?.alias ?? {}),
            "@": path.join(process.cwd(), "src"),
          },
        },
      }),
    }).catch((error) => {
      bundlePromise = null;
      throw error;
    });
  }
  return bundlePromise;
}

async function updateManifest(
  manifest: RenderManifest,
  update: Partial<
    Pick<RenderManifest, "status" | "progress" | "error" | "fileName">
  >,
) {
  const next = renderManifestSchema.parse({
    ...manifest,
    ...update,
    updatedAt: new Date().toISOString(),
  });
  await writeManifest(next);
  return next;
}

async function writeManifest(manifest: RenderManifest) {
  const target = manifestPath(manifest.projectId, manifest.jobId);
  const temporary = `${target}.tmp-${randomUUID()}`;
  await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

async function readManifest(projectId: string, jobId: string) {
  renderJobIdSchema.parse(jobId);
  try {
    const manifest = renderManifestSchema.parse(
      JSON.parse(await readFile(manifestPath(projectId, jobId), "utf8")),
    );
    if (manifest.projectId !== projectId || manifest.jobId !== jobId) {
      throw new Error("Mismatched render");
    }
    return manifest;
  } catch {
    throw new ToolServiceError("not-found", "The render is unavailable.");
  }
}

function buildFileName(script: ChatStoryScript) {
  const slug =
    script.title
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase()
      .slice(0, 80) || "chat-story";
  return `${slug}-${new Date().toISOString().replace(/[:.]/g, "-")}.mp4`;
}

function renderProjectDirectory(projectId: string) {
  return resolveWithinWorkspace("projects", projectId, "chat-story-studio");
}

function renderDirectory(projectId: string, jobId: string) {
  renderJobIdSchema.parse(jobId);
  return resolveWithinWorkspace(
    "projects",
    projectId,
    "chat-story-studio",
    jobId,
  );
}

function manifestPath(projectId: string, jobId: string) {
  return path.join(renderDirectory(projectId, jobId), "manifest.json");
}

function renderPath(projectId: string, jobId: string) {
  return path.join(renderDirectory(projectId, jobId), "chat-story.mp4");
}

function renderKey(projectId: string, jobId: string) {
  return `${projectId}:${jobId}`;
}

function resolveWithinWorkspace(...segments: string[]) {
  const root = mediaToolsWorkspaceRoot();
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new ToolServiceError("invalid", "Media artifact path is invalid.");
  }
  return resolved;
}
