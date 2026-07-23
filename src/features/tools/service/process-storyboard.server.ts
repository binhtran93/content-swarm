import "server-only";

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import type {
  StoryboardJobManifest,
  StoryboardPanel,
} from "@/features/tools/model/storyboard-splitter-job";
import { detectStoryboardPanels } from "@/features/tools/service/detect-storyboard-panels";
import { createPanelsZip } from "@/features/tools/service/create-panels-zip.server";
import {
  storyboardJobPath,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import { runRealEsrgan } from "@/features/tools/service/run-real-esrgan.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const maximumInputPixels = 40_000_000;

export async function processStoryboard(
  manifest: StoryboardJobManifest,
): Promise<StoryboardJobManifest> {
  const { projectId, jobId } = manifest;
  const sourcePath = storyboardJobPath(projectId, jobId, "source.png");
  const rawDirectory = storyboardJobPath(projectId, jobId, "raw-panels");
  const enhancedDirectory = storyboardJobPath(
    projectId,
    jobId,
    "enhanced-panels",
  );
  await Promise.all([
    mkdir(rawDirectory, { recursive: true }),
    mkdir(enhancedDirectory, { recursive: true }),
  ]);

  let hasOverlay = false;
  try {
    const { data, info } = await sharp(sourcePath, {
      failOn: "warning",
      limitInputPixels: maximumInputPixels,
    })
      .flatten({ background: "#ffffff" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rectangles = detectStoryboardPanels({
      pixels: data,
      width: info.width,
      height: info.height,
    });
    if (!rectangles.length) {
      throw new ToolServiceError(
        "failed",
        "No bordered panels were detected. Upload a sheet with clear dark rectangular borders.",
      );
    }

    await writeDetectionOverlay({
      sourcePath,
      target: storyboardJobPath(projectId, jobId, "detection-overlay.png"),
      width: info.width,
      height: info.height,
      rectangles,
    });
    hasOverlay = true;

    const rawPanels = await Promise.all(
      rectangles.map(async (rectangle, index) => {
        const panelId = `panel-${String(index + 1).padStart(2, "0")}`;
        const fileName = `${panelId}.png`;
        const inset = rectangle.inset;
        const extract = {
          left: rectangle.x + inset,
          top: rectangle.y + inset,
          width: rectangle.width - inset * 2,
          height: rectangle.height - inset * 2,
        };
        if (extract.width <= 0 || extract.height <= 0) {
          throw new ToolServiceError(
            "failed",
            "A detected panel was too small to crop.",
          );
        }
        await sharp(sourcePath)
          .extract(extract)
          .png({ compressionLevel: 9 })
          .toFile(path.join(rawDirectory, fileName));
        return {
          panelId,
          fileName,
          bounds: {
            x: rectangle.x,
            y: rectangle.y,
            width: rectangle.width,
            height: rectangle.height,
          },
        };
      }),
    );

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

    const zipPath = storyboardJobPath(projectId, jobId, "panels.zip");
    await createPanelsZip({
      panels: panels.map((panel) => ({
        source: path.join(enhancedDirectory, panel.fileName),
        fileName: panel.fileName,
      })),
      target: zipPath,
    });

    const completed: StoryboardJobManifest = {
      ...manifest,
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
      ...manifest,
      status: "failed",
      panels: [],
      panelCount: 0,
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
  rectangles: ReturnType<typeof detectStoryboardPanels>;
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
