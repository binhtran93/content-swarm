import { execFile } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { ZipArchive } from "archiver";
import sharp from "sharp";

import { detectStoryboardPanels } from "../src/features/tools/service/detect-storyboard-panels.ts";

const executeFile = promisify(execFile);
const workspace = await mkdtemp(path.join(os.tmpdir(), "storyboard-smoke-"));
const input = path.join(workspace, "input.png");
const rawDirectory = path.join(workspace, "raw");
const outputDirectory = path.join(workspace, "enhanced");
const zipPath = path.join(workspace, "panels.zip");
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
  const cropBounds = panels.map((panel) => ({
    x: panel.x + panel.inset,
    y: panel.y + panel.inset,
    width: panel.width - panel.inset * 2,
    height: panel.height - panel.inset * 2,
  }));
  cropBounds[0] = {
    ...cropBounds[0],
    x: cropBounds[0].x + 5,
    width: cropBounds[0].width - 5,
  };

  await Promise.all(
    cropBounds.map((panel, index) =>
      sharp(input)
        .extract({
          left: panel.x,
          top: panel.y,
          width: panel.width,
          height: panel.height,
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
  if (metadata.width !== cropBounds[0].width * 4) {
    throw new Error("Real-ESRGAN did not produce a 4× output.");
  }
  await new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);
    for (let index = 0; index < cropBounds.length; index += 1) {
      const fileName = `panel-${String(index + 1).padStart(2, "0")}.png`;
      archive.file(path.join(outputDirectory, fileName), { name: fileName });
    }
    void archive.finalize();
  });
  if ((await stat(zipPath)).size <= 0) {
    throw new Error("ZIP output was not created.");
  }
  console.log(
    `Storyboard Splitter smoke test passed: ${panels.length} reviewed panels, first output ${metadata.width}×${metadata.height}, ZIP created.`,
  );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
