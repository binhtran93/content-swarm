import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

import { detectStoryboardPanels } from "../src/features/tools/service/detect-storyboard-panels.ts";

const executeFile = promisify(execFile);
const workspace = await mkdtemp(path.join(os.tmpdir(), "storyboard-smoke-"));
const input = path.join(workspace, "input.png");
const rawDirectory = path.join(workspace, "raw");
const outputDirectory = path.join(workspace, "enhanced");
const installation = path.resolve(".media-tools/realesrgan");

try {
  await Promise.all([
    mkdir(rawDirectory, { recursive: true }),
    mkdir(outputDirectory, { recursive: true }),
  ]);
  const width = 600;
  const height = 500;
  const svg =
    Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    <g fill="none" stroke="black" stroke-width="4">
      <rect x="10" y="10" width="280" height="220"/>
      <rect x="310" y="10" width="280" height="220"/>
      <rect x="10" y="250" width="280" height="220"/>
      <rect x="310" y="250" width="280" height="220"/>
    </g>
  </svg>`);
  await sharp(svg).png().toFile(input);
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const panels = detectStoryboardPanels({
    pixels: data,
    width: info.width,
    height: info.height,
  });
  if (panels.length !== 4) {
    throw new Error(`Expected 4 panels, detected ${panels.length}.`);
  }

  await Promise.all(
    panels.map((panel, index) =>
      sharp(input)
        .extract({
          left: panel.x + panel.inset,
          top: panel.y + panel.inset,
          width: panel.width - panel.inset * 2,
          height: panel.height - panel.inset * 2,
        })
        .png()
        .toFile(
          path.join(
            rawDirectory,
            `panel-${String(index + 1).padStart(2, "0")}.png`,
          ),
        ),
    ),
  );

  await executeFile(
    path.join(installation, "realesrgan-ncnn-vulkan"),
    [
      "-i",
      rawDirectory,
      "-o",
      outputDirectory,
      "-n",
      "realesr-animevideov3",
      "-s",
      "4",
      "-f",
      "png",
      "-m",
      path.join(installation, "models"),
    ],
    { cwd: installation, timeout: 5 * 60 * 1000 },
  );

  const metadata = await sharp(
    path.join(outputDirectory, "panel-01.png"),
  ).metadata();
  if (!metadata.width || metadata.width < 1000) {
    throw new Error("Real-ESRGAN did not produce a 4× output.");
  }
  console.log(
    `Storyboard Splitter smoke test passed: ${panels.length} panels, first output ${metadata.width}×${metadata.height}.`,
  );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
