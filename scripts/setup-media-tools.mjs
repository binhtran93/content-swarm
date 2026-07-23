import { createHash } from "node:crypto";
import {
  access,
  chmod,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const releaseUrl =
  "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-macos.zip";
const expectedSha256 =
  "e0ad05580abfeb25f8d8fb55aaf7bedf552c375b5b4d9bd3c8d59764d2cc333a";
const toolDirectory = path.resolve(".media-tools/realesrgan");
const binaryPath = path.join(toolDirectory, "realesrgan-ncnn-vulkan");
const modelPath = path.join(
  toolDirectory,
  "models/realesr-animevideov3-x4.param",
);

if (process.platform !== "darwin") {
  throw new Error("Storyboard Splitter setup currently supports macOS only.");
}
if (!["arm64", "x64"].includes(process.arch)) {
  throw new Error(`Unsupported Mac architecture: ${process.arch}`);
}

const existing = spawnSync(binaryPath, ["-h"], {
  cwd: toolDirectory,
  encoding: "utf8",
});
if (canRun(existing) && (await exists(modelPath))) {
  console.log(`Real-ESRGAN is ready at ${toolDirectory}`);
  process.exit(0);
}

const archivePath = path.resolve(".media-tools/realesrgan-macos.zip");
await mkdir(path.dirname(archivePath), { recursive: true });
console.log("Downloading Real-ESRGAN…");
const response = await fetch(releaseUrl);
if (!response.ok) {
  throw new Error(`Real-ESRGAN download failed (${response.status}).`);
}
const archive = Buffer.from(await response.arrayBuffer());
await writeFile(archivePath, archive);

const digest = createHash("sha256")
  .update(await readFile(archivePath))
  .digest("hex");
if (digest !== expectedSha256) {
  await rm(archivePath, { force: true });
  throw new Error("Real-ESRGAN download checksum did not match.");
}

await rm(toolDirectory, { recursive: true, force: true });
await mkdir(toolDirectory, { recursive: true });
const extracted = spawnSync(
  "/usr/bin/ditto",
  ["-x", "-k", archivePath, toolDirectory],
  { encoding: "utf8" },
);
await rm(archivePath, { force: true });
if (extracted.status !== 0) {
  throw new Error(extracted.stderr || "Could not extract Real-ESRGAN.");
}

await chmod(binaryPath, 0o755);
if (!(await exists(modelPath))) {
  throw new Error("The Real-ESRGAN animation model is missing.");
}
const verification = spawnSync(binaryPath, ["-h"], {
  cwd: toolDirectory,
  encoding: "utf8",
});
if (!canRun(verification)) {
  throw new Error(
    verification.stderr || "The Real-ESRGAN executable could not start.",
  );
}

console.log(`Real-ESRGAN is ready at ${toolDirectory}`);

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function canRun(result) {
  return (
    result.status === 0 ||
    `${result.stdout ?? ""}${result.stderr ?? ""}`.includes(
      "Usage: realesrgan-ncnn-vulkan",
    )
  );
}
