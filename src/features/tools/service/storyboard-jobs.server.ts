import "server-only";

import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import sharp from "sharp";

import {
  storyboardCropBoundsSchema,
  storyboardJobNameSchema,
  type PanelBounds,
  type StoryboardJobManifest,
} from "@/features/tools/model/storyboard-splitter-job";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import {
  createStoryboardJobDirectory,
  getLocalMediaToolsCapability,
  listLocalStoryboardJobs,
  readStoryboardJobManifest,
  removeLocalStoryboardJob,
  storyboardJobPath,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import {
  detectStoryboard,
  processStoryboard,
} from "@/features/tools/service/process-storyboard.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const maximumUploadBytes = 25 * 1024 * 1024;
const maximumInputPixels = 40_000_000;
const allowedContentTypes = new Set(["image/jpeg", "image/png"]);

export async function createStoryboardJob(projectId: string, file: File) {
  await getProjectContext(projectId);
  const capability = await getLocalMediaToolsCapability();
  if (!capability.available) {
    throw new ToolServiceError("disabled", capability.message);
  }
  if (
    !allowedContentTypes.has(file.type) ||
    file.size <= 0 ||
    file.size > maximumUploadBytes
  ) {
    throw new ToolServiceError(
      "invalid",
      "Upload a PNG or JPEG image no larger than 25 MB.",
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  let decodedFormat: string | undefined;
  try {
    decodedFormat = (
      await sharp(input, {
        failOn: "warning",
        limitInputPixels: maximumInputPixels,
      }).metadata()
    ).format;
  } catch {
    throw new ToolServiceError(
      "invalid",
      "The uploaded image could not be decoded safely.",
    );
  }
  if (!["jpeg", "png"].includes(decodedFormat ?? "")) {
    throw new ToolServiceError("invalid", "Upload a valid PNG or JPEG image.");
  }

  const jobId = randomUUID();
  await createStoryboardJobDirectory(projectId, jobId);
  const sourcePath = storyboardJobPath(projectId, jobId, "source.png");
  try {
    await sharp(input, {
      failOn: "warning",
      limitInputPixels: maximumInputPixels,
    })
      .autoOrient()
      .png({ compressionLevel: 9 })
      .toFile(sourcePath);
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new ToolServiceError(
        "invalid",
        "The uploaded image has invalid dimensions.",
      );
    }

    const now = new Date().toISOString();
    const defaultName =
      basename(file.name, extname(file.name)).trim().slice(0, 100) ||
      "Storyboard";
    const manifest: StoryboardJobManifest = {
      schemaVersion: 2,
      projectId,
      jobId,
      name: defaultName,
      status: "processing",
      source: {
        originalName: basename(file.name).slice(0, 255) || "storyboard",
        contentType: decodedFormat === "jpeg" ? "image/jpeg" : "image/png",
        width: metadata.width,
        height: metadata.height,
      },
      panels: [],
      detectedBounds: [],
      cropBounds: [],
      panelCount: 0,
      hasOverlay: false,
      hasZip: false,
      error: null,
      createdAt: now,
      updatedAt: now,
    };
    await writeStoryboardJobManifest(manifest);
    return detectStoryboard(manifest);
  } catch (error) {
    if (error instanceof ToolServiceError) {
      await removeLocalStoryboardJob(projectId, jobId).catch(() => undefined);
      throw error;
    }
    await removeLocalStoryboardJob(projectId, jobId).catch(() => undefined);
    throw new ToolServiceError(
      "failed",
      "The storyboard could not be saved for processing.",
    );
  }
}

export async function listStoryboardJobs(projectId: string) {
  await getProjectContext(projectId);
  return listLocalStoryboardJobs(projectId);
}

export async function getStoryboardJob(projectId: string, jobId: string) {
  await getProjectContext(projectId);
  return readStoryboardJobManifest(projectId, jobId);
}

export async function renameStoryboardJob(
  projectId: string,
  jobId: string,
  name: string,
) {
  const manifest = await getStoryboardJob(projectId, jobId);
  const updated: StoryboardJobManifest = {
    ...manifest,
    name: storyboardJobNameSchema.parse(name),
    updatedAt: new Date().toISOString(),
  };
  await writeStoryboardJobManifest(updated);
  return updated;
}

export async function saveStoryboardCrops(
  projectId: string,
  jobId: string,
  rectangles: PanelBounds[],
) {
  const manifest = await getStoryboardJob(projectId, jobId);
  if (
    !manifest.detectedBounds.length ||
    !["review", "failed", "ready"].includes(manifest.status)
  ) {
    throw new ToolServiceError(
      "invalid",
      "Crop rectangles cannot be edited for this job.",
    );
  }
  const cropBounds = validateCropBounds(manifest, rectangles);
  const updated: StoryboardJobManifest = {
    ...manifest,
    status: manifest.status === "ready" ? "ready" : "review",
    cropBounds,
    panelCount: cropBounds.length,
    error: null,
    updatedAt: new Date().toISOString(),
  };
  await writeStoryboardJobManifest(updated);
  return updated;
}

export async function processStoryboardJob(
  projectId: string,
  jobId: string,
  rectangles: PanelBounds[],
) {
  const [manifest, project] = await Promise.all([
    getStoryboardJob(projectId, jobId),
    getProjectContext(projectId),
  ]);
  if (
    !manifest.detectedBounds.length ||
    !["review", "failed", "ready"].includes(manifest.status)
  ) {
    throw new ToolServiceError(
      "invalid",
      "This storyboard cannot be processed from its current state.",
    );
  }
  return processStoryboard(manifest, validateCropBounds(manifest, rectangles), {
    projectId: project.projectId,
    name: project.name,
    description: project.description,
  });
}

export async function deleteStoryboardJob(projectId: string, jobId: string) {
  await getStoryboardJob(projectId, jobId);
  try {
    await removeLocalStoryboardJob(projectId, jobId);
  } catch {
    throw new ToolServiceError(
      "failed",
      "The local storyboard job could not be deleted.",
    );
  }
}

function validateCropBounds(
  manifest: StoryboardJobManifest,
  rectangles: PanelBounds[],
) {
  const parsed = storyboardCropBoundsSchema.parse(rectangles);
  for (const rectangle of parsed) {
    if (
      rectangle.x + rectangle.width > manifest.source.width ||
      rectangle.y + rectangle.height > manifest.source.height
    ) {
      throw new ToolServiceError(
        "invalid",
        "Every crop rectangle must stay inside the source image.",
      );
    }
  }
  return parsed;
}
