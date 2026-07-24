import { copyFile, mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StoryboardJobManifest } from "@/features/tools/model/storyboard-splitter-job";
import {
  createStoryboardJobDirectory,
  storyboardJobPath,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import {
  detectStoryboard,
  extractRawPanels,
  processStoryboard,
  renderProjectCtaCard,
} from "@/features/tools/service/process-storyboard.server";

vi.mock("@/features/tools/service/run-real-esrgan.server", () => ({
  runRealEsrgan: vi.fn(
    async ({
      inputDirectory,
      outputDirectory,
    }: {
      inputDirectory: string;
      outputDirectory: string;
    }) => {
      for (const fileName of await readdir(inputDirectory)) {
        await copyFile(
          path.join(inputDirectory, fileName),
          path.join(outputDirectory, fileName),
        );
      }
    },
  ),
}));

const jobId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";
let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(path.join(os.tmpdir(), "storyboard-process-test-"));
  process.env.MEDIA_TOOLS_WORKSPACE_DIR = workspace;
  await createStoryboardJobDirectory("urge-zero", jobId);
});

afterEach(async () => {
  delete process.env.MEDIA_TOOLS_WORKSPACE_DIR;
  await rm(workspace, { recursive: true, force: true });
});

describe("storyboard processing stages", () => {
  it("stops at review after detecting exact crop rectangles", async () => {
    const source = storyboardJobPath("urge-zero", jobId, "source.png");
    await sharp(
      Buffer.from(`<svg width="600" height="500" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="500" fill="white"/>
        <rect x="10" y="10" width="580" height="480" fill="none" stroke="black" stroke-width="4"/>
      </svg>`),
    )
      .png()
      .toFile(source);
    const manifest = processingManifest();
    await writeStoryboardJobManifest(manifest);

    const review = await detectStoryboard(manifest);

    expect(review.status).toBe("review");
    expect(review.cropBounds).toHaveLength(1);
    expect(review.panels).toEqual([]);
    expect(review.hasZip).toBe(false);
    expect(review.cropBounds[0]?.x).toBeGreaterThan(10);
  });

  it("extracts edited bounds exactly without another inset", async () => {
    const source = storyboardJobPath("urge-zero", jobId, "source.png");
    const rawDirectory = storyboardJobPath("urge-zero", jobId, "raw-panels");
    await mkdir(rawDirectory, { recursive: true });
    await sharp({
      create: {
        width: 200,
        height: 160,
        channels: 3,
        background: "#ffffff",
      },
    })
      .png()
      .toFile(source);

    await extractRawPanels({
      sourcePath: source,
      rawDirectory,
      rectangles: [{ x: 20, y: 30, width: 80, height: 60 }],
    });

    await expect(
      sharp(path.join(rawDirectory, "panel-01.png")).metadata(),
    ).resolves.toMatchObject({ width: 80, height: 60, format: "png" });
  });

  it("renders the fixed Project CTA card", async () => {
    const panelPath = path.join(workspace, "end-card.png");

    await renderProjectCtaCard({
      panelPath,
      width: 360,
      height: 640,
      branding: {
        projectId: "urge-zero",
        name: "UrgeZero",
        description: "Overcome porn addiction and build lasting self-control",
        showAppStore: true,
        showGooglePlay: true,
      },
    });

    const { data, info } = await sharp(panelPath)
      .resize({ width: 80 })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(info.height).toBeGreaterThan(info.width);
    expect([...data].some((pixel) => pixel > 200)).toBe(true);
  });

  it("appends the code-rendered final card after illustrated panels", async () => {
    const source = storyboardJobPath("urge-zero", jobId, "source.png");
    await sharp({
      create: {
        width: 180,
        height: 320,
        channels: 3,
        background: "#ffffff",
      },
    })
      .png()
      .toFile(source);
    const manifest: StoryboardJobManifest = {
      ...processingManifest(),
      status: "review",
      source: {
        originalName: "storyboard.png",
        contentType: "image/png",
        width: 180,
        height: 320,
      },
      detectedBounds: [{ x: 0, y: 0, width: 180, height: 320 }],
      cropBounds: [{ x: 0, y: 0, width: 180, height: 320 }],
    };
    await writeStoryboardJobManifest(manifest);

    const completed = await processStoryboard(manifest, manifest.cropBounds, {
      projectId: "urge-zero",
      name: "UrgeZero",
      description: "Overcome porn addiction and build lasting self-control",
      showAppStore: true,
      showGooglePlay: true,
    });

    expect(completed.status).toBe("ready");
    expect(completed.panels).toHaveLength(2);
    expect(completed.panels[1]).toMatchObject({
      panelId: "panel-02",
      fileName: "panel-02.png",
      width: 180,
      height: 320,
    });
  });
});

function processingManifest(): StoryboardJobManifest {
  const now = "2026-07-23T03:00:00.000Z";
  return {
    schemaVersion: 2,
    projectId: "urge-zero",
    jobId,
    name: "Storyboard",
    endCardQuestion: "",
    status: "processing",
    source: {
      originalName: "storyboard.png",
      contentType: "image/png",
      width: 600,
      height: 500,
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
}
