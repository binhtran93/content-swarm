import "server-only";

import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import type {
  PanelBounds,
  StoryboardJobManifest,
  StoryboardPanel,
} from "@/features/tools/model/storyboard-splitter-job";
import { sortPanelBoundsReadingOrder } from "@/features/tools/model/storyboard-crop-geometry";
import { createPanelsZip } from "@/features/tools/service/create-panels-zip.server";
import { detectStoryboardPanels } from "@/features/tools/service/detect-storyboard-panels";
import {
  storyboardJobPath,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import { runRealEsrgan } from "@/features/tools/service/run-real-esrgan.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const maximumInputPixels = 40_000_000;

export async function detectStoryboard(
  manifest: StoryboardJobManifest,
): Promise<StoryboardJobManifest> {
  const { projectId, jobId } = manifest;
  const sourcePath = storyboardJobPath(projectId, jobId, "source.png");
  try {
    const { data, info } = await sharp(sourcePath, {
      failOn: "warning",
      limitInputPixels: maximumInputPixels,
    })
      .flatten({ background: "#ffffff" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const detections = detectStoryboardPanels({
      pixels: data,
      width: info.width,
      height: info.height,
    });
    if (!detections.length) {
      throw new ToolServiceError(
        "failed",
        "No bordered panels were detected. Upload a sheet with clear dark rectangular borders.",
      );
    }

    const cropBounds = detections.map(({ inset, ...rectangle }) => ({
      x: rectangle.x + inset,
      y: rectangle.y + inset,
      width: rectangle.width - inset * 2,
      height: rectangle.height - inset * 2,
    }));
    await writeDetectionOverlay({
      sourcePath,
      target: storyboardJobPath(projectId, jobId, "detection-overlay.png"),
      width: info.width,
      height: info.height,
      rectangles: cropBounds,
    });

    const review: StoryboardJobManifest = {
      ...manifest,
      status: "review",
      detectedBounds: cropBounds,
      cropBounds,
      panelCount: cropBounds.length,
      hasOverlay: true,
      error: null,
      updatedAt: new Date().toISOString(),
    };
    await writeStoryboardJobManifest(review);
    return review;
  } catch (error) {
    const failed: StoryboardJobManifest = {
      ...manifest,
      status: "failed",
      detectedBounds: [],
      cropBounds: [],
      panelCount: 0,
      hasOverlay: false,
      hasZip: false,
      error:
        error instanceof ToolServiceError
          ? error.message
          : "The storyboard could not be analyzed.",
      updatedAt: new Date().toISOString(),
    };
    await writeStoryboardJobManifest(failed);
    return failed;
  }
}

export async function processStoryboard(
  manifest: StoryboardJobManifest,
  rectangles: PanelBounds[],
): Promise<StoryboardJobManifest> {
  const { projectId, jobId } = manifest;
  const sourcePath = storyboardJobPath(projectId, jobId, "source.png");
  const rawDirectory = storyboardJobPath(projectId, jobId, "raw-panels");
  const enhancedDirectory = storyboardJobPath(
    projectId,
    jobId,
    "enhanced-panels",
  );
  const zipPath = storyboardJobPath(projectId, jobId, "panels.zip");
  const orderedRectangles = sortPanelBoundsReadingOrder(rectangles);
  const processing: StoryboardJobManifest = {
    ...manifest,
    status: "processing",
    cropBounds: rectangles,
    panels: [],
    panelCount: rectangles.length,
    hasZip: false,
    error: null,
    updatedAt: new Date().toISOString(),
  };
  await writeStoryboardJobManifest(processing);

  let hasOverlay = manifest.hasOverlay;
  try {
    await Promise.all([
      rm(rawDirectory, { recursive: true, force: true }),
      rm(enhancedDirectory, { recursive: true, force: true }),
      rm(zipPath, { force: true }),
    ]);
    await Promise.all([
      mkdir(rawDirectory, { recursive: true }),
      mkdir(enhancedDirectory, { recursive: true }),
    ]);
    await writeDetectionOverlay({
      sourcePath,
      target: storyboardJobPath(projectId, jobId, "detection-overlay.png"),
      width: manifest.source.width,
      height: manifest.source.height,
      rectangles: orderedRectangles,
    });
    hasOverlay = true;

    const rawPanels = await extractRawPanels({
      sourcePath,
      rawDirectory,
      rectangles: orderedRectangles,
    });
    await runRealEsrgan({
      inputDirectory: rawDirectory,
      outputDirectory: enhancedDirectory,
    });

    const panels: StoryboardPanel[] = await Promise.all(
      rawPanels.map(async (panel) => {
        const metadata = await sharp(
          path.join(enhancedDirectory, panel.fileName),
        ).metadata();
        if (!metadata.width || !metadata.height) {
          throw new ToolServiceError(
            "failed",
            `Enhanced output is missing for ${panel.fileName}.`,
          );
        }
        return {
          ...panel,
          width: metadata.width,
          height: metadata.height,
        };
      }),
    );

    await createPanelsZip({
      panels: panels.map((panel) => ({
        source: path.join(enhancedDirectory, panel.fileName),
        fileName: panel.fileName,
      })),
      target: zipPath,
    });

    const completed: StoryboardJobManifest = {
      ...processing,
      status: "ready",
      panels,
      panelCount: panels.length,
      hasOverlay,
      hasZip: true,
      error: null,
      updatedAt: new Date().toISOString(),
    };
    await writeStoryboardJobManifest(completed);
    return completed;
  } catch (error) {
    const failed: StoryboardJobManifest = {
      ...processing,
      status: "failed",
      panels: [],
      hasOverlay,
      hasZip: false,
      error:
        error instanceof ToolServiceError
          ? error.message
          : "The storyboard could not be processed.",
      updatedAt: new Date().toISOString(),
    };
    await writeStoryboardJobManifest(failed);
    return failed;
  }
}

export async function extractRawPanels({
  sourcePath,
  rawDirectory,
  rectangles,
}: {
  sourcePath: string;
  rawDirectory: string;
  rectangles: PanelBounds[];
}) {
  return Promise.all(
    rectangles.map(async (bounds, index) => {
      const panelId = `panel-${String(index + 1).padStart(2, "0")}`;
      const fileName = `${panelId}.png`;
      await sharp(sourcePath)
        .extract({
          left: bounds.x,
          top: bounds.y,
          width: bounds.width,
          height: bounds.height,
        })
        .png({ compressionLevel: 9 })
        .toFile(path.join(rawDirectory, fileName));
      return { panelId, fileName, bounds };
    }),
  );
}

async function writeDetectionOverlay({
  sourcePath,
  target,
  width,
  height,
  rectangles,
}: {
  sourcePath: string;
  target: string;
  width: number;
  height: number;
  rectangles: PanelBounds[];
}) {
  const strokeWidth = Math.max(2, Math.round(Math.min(width, height) / 300));
  const fontSize = Math.max(18, Math.round(Math.min(width, height) / 30));
  const marks = rectangles
    .map(
      (rectangle, index) => `
        <rect x="${rectangle.x}" y="${rectangle.y}" width="${rectangle.width}" height="${rectangle.height}"
          fill="none" stroke="#ef4444" stroke-width="${strokeWidth}" />
        <circle cx="${rectangle.x + fontSize}" cy="${rectangle.y + fontSize}" r="${fontSize * 0.72}"
          fill="#ef4444" />
        <text x="${rectangle.x + fontSize}" y="${rectangle.y + fontSize * 1.32}"
          fill="white" font-family="sans-serif" font-size="${fontSize}" font-weight="700"
          text-anchor="middle">${index + 1}</text>`,
    )
    .join("");
  const svg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${marks}</svg>`,
  );
  await sharp(sourcePath)
    .composite([{ input: svg, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(target);
}
