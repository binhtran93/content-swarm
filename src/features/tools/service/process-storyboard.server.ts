import "server-only";

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

export type StoryboardCtaBranding = {
  projectId: string;
  name: string;
  description: string;
  showAppStore: boolean;
  showGooglePlay: boolean;
};

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
  branding?: StoryboardCtaBranding,
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
    panelCount: rectangles.length + (branding ? 1 : 0),
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
    if (branding) {
      const firstPanel = panels[0];
      if (!firstPanel) {
        throw new ToolServiceError(
          "failed",
          "At least one illustrated panel is required.",
        );
      }
      const panelNumber = panels.length + 1;
      const panelId = `panel-${String(panelNumber).padStart(2, "0")}`;
      const fileName = `${panelId}.png`;
      await renderProjectCtaCard({
        panelPath: path.join(enhancedDirectory, fileName),
        width: firstPanel.width,
        height: firstPanel.height,
        branding,
      });
      panels.push({
        panelId,
        fileName,
        bounds: {
          x: 0,
          y: 0,
          width: firstPanel.width,
          height: firstPanel.height,
        },
        width: firstPanel.width,
        height: firstPanel.height,
      });
    }

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

export async function renderProjectCtaCard({
  panelPath,
  width,
  height,
  branding,
}: {
  panelPath: string;
  width: number;
  height: number;
  branding: StoryboardCtaBranding;
}) {
  await writeFile(
    panelPath,
    await createProjectCtaCard({ width, height, branding }),
  );
}

export async function createProjectCtaCard({
  width,
  height,
  branding,
}: {
  width: number;
  height: number;
  branding: StoryboardCtaBranding;
}) {
  const logo =
    (await readProjectAsset(branding.projectId, "logo.png")) ??
    (await readProjectAsset(branding.projectId, "logo-full.png"));
  const logoSize = Math.max(
    72,
    Math.round(Math.min(width * 0.22, height * 0.14)),
  );
  const logoTop = Math.round(height * 0.13);
  const centerX = Math.round(width * 0.42);
  const nameSize = Math.max(42, Math.round(width * 0.075));
  const descriptionSize = Math.max(26, Math.round(width * 0.039));
  const nameTop = logoTop + logoSize + Math.round(height * 0.045);
  const descriptionLines = wrapText(
    shortenDescription(branding.description),
    30,
    3,
  );
  const descriptionLineHeight = Math.round(descriptionSize * 1.35);
  const descriptionTop = nameTop + nameSize + Math.round(height * 0.035);
  const stores = [
    branding.showAppStore ? "app-store" : null,
    branding.showGooglePlay ? "google-play" : null,
  ].filter((store): store is "app-store" | "google-play" => Boolean(store));
  const availabilityTop =
    descriptionTop +
    descriptionLines.length * descriptionLineHeight +
    Math.round(height * 0.06);
  const badgeTop = availabilityTop + Math.round(height * 0.045);
  const badgeWidth = Math.round(width * 0.25);
  const badgeHeight = Math.round(badgeWidth * 0.3);
  const badgeGap = Math.round(width * 0.035);
  const totalBadgeWidth =
    stores.length * badgeWidth + Math.max(0, stores.length - 1) * badgeGap;
  const badgeLeft = Math.round(centerX - totalBadgeWidth / 2);
  const cardText = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${centerX}" y="${nameTop + nameSize}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${nameSize}" font-weight="800" text-anchor="middle">${escapeXml(branding.name)}</text>
      ${descriptionLines
        .map(
          (line, index) =>
            `<text x="${centerX}" y="${descriptionTop + descriptionSize + descriptionLineHeight * index}" fill="#cbd0d8" font-family="Arial, Helvetica, sans-serif" font-size="${descriptionSize}" font-weight="400" text-anchor="middle">${escapeXml(line)}</text>`,
        )
        .join("")}
      <text x="${centerX}" y="${availabilityTop}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(22, Math.round(width * 0.027))}" font-weight="700" letter-spacing="${Math.max(2, Math.round(width * 0.004))}" text-anchor="middle">${stores.length ? "AVAILABLE NOW" : "GET STARTED TODAY"}</text>
      <line x1="${centerX - Math.round(width * 0.12)}" y1="${availabilityTop + Math.round(height * 0.018)}" x2="${centerX + Math.round(width * 0.12)}" y2="${availabilityTop + Math.round(height * 0.018)}" stroke="#ef1b2d" stroke-width="${Math.max(4, Math.round(width * 0.006))}" stroke-linecap="round" />
    </svg>`);
  const composites = [{ input: cardText, top: 0, left: 0 }];

  if (logo) {
    composites.push({
      input: await roundedBrandThumbnail(logo, logoSize),
      top: logoTop,
      left: Math.round(centerX - logoSize / 2),
    });
  }
  for (const [index, store] of stores.entries()) {
    composites.push({
      input: await createStoreBadge({
        projectId: branding.projectId,
        store,
        width: badgeWidth,
        height: badgeHeight,
      }),
      top: badgeTop,
      left: badgeLeft + index * (badgeWidth + badgeGap),
    });
  }
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#000000",
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function createStoreBadge({
  projectId,
  store,
  width,
  height,
}: {
  projectId: string;
  store: "app-store" | "google-play";
  width: number;
  height: number;
}) {
  const filename = store === "app-store" ? "app-store.svg" : "google-play.svg";
  const asset = await readProjectAsset(projectId, filename);
  if (asset) {
    return sharp(asset)
      .resize({ width, height, fit: "contain" })
      .png()
      .toBuffer();
  }
  const label =
    store === "app-store"
      ? "Download on the App Store"
      : "Get it on Google Play";
  return sharp(
    Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.round(height * 0.14)}" fill="#050505" stroke="#ffffff" stroke-width="2" />
        <text x="${width / 2}" y="${height * 0.58}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(12, Math.round(height * 0.22))}" font-weight="700" text-anchor="middle">${label}</text>
      </svg>`),
  )
    .png()
    .toBuffer();
}

async function roundedBrandThumbnail(input: Buffer, size: number) {
  const radius = Math.max(12, Math.round(size * 0.18));
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff" /></svg>`,
  );
  return sharp(input)
    .resize({ width: size, height: size, fit: "cover" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function readProjectAsset(projectId: string, filename: string) {
  try {
    return await readFile(
      path.join(process.cwd(), "public", projectId, filename),
    );
  } catch {
    return null;
  }
}

function shortenDescription(description: string) {
  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length <= 110) return normalized;
  return `${normalized.slice(0, 107).trimEnd()}…`;
}

function wrapText(
  value: string,
  maximumCharacters: number,
  maximumLines: number,
) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maximumCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === maximumLines) break;
  }
  if (line && lines.length < maximumLines) lines.push(line);
  return lines;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    return (
      {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      }[character] ?? character
    );
  });
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
