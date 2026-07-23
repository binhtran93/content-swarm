import { bundle } from "@remotion/bundler";
import {
  getVideoMetadata,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const workspace = await mkdtemp(path.join(os.tmpdir(), "chat-video-smoke-"));
const output = path.join(workspace, "chat-story.mp4");
const script = {
  version: 1,
  title: "Render smoke test",
  participants: [
    { id: "left", displayName: "Maya" },
    { id: "right", displayName: "Noah" },
  ],
  messages: Array.from({ length: 20 }, (_, index) => ({
    id: `m${index + 1}`,
    senderId: index % 2 ? "right" : "left",
    text: `Message ${index + 1}`,
    waitMs: 500,
    typingMs: 1_500,
    sound: index === 18 ? "reveal" : index % 2 ? "outgoing" : "incoming",
  })),
};

try {
  const serveUrl = await bundle({
    entryPoint: path.join(
      process.cwd(),
      "src/features/tools/video/remotion-entry.tsx",
    ),
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
  });
  const composition = await selectComposition({
    serveUrl,
    id: "ChatStory",
    inputProps: { script },
    logLevel: "warn",
  });
  await renderMedia({
    serveUrl,
    composition,
    inputProps: { script },
    outputLocation: output,
    codec: "h264",
    audioCodec: "aac",
    pixelFormat: "yuv420p",
    frameRange: [0, 89],
    scale: 0.25,
    overwrite: true,
    logLevel: "warn",
  });

  const metadata = await getVideoMetadata(output, { logLevel: "warn" });
  assert.equal(metadata.width, 270);
  assert.equal(metadata.height, 480);
  assert.equal(metadata.fps, 30);
  assert.equal(metadata.codec, "h264");
  assert.equal(metadata.audioCodec, "aac");
  assert.ok(
    metadata.durationInSeconds !== null &&
      metadata.durationInSeconds >= 2.9 &&
      metadata.durationInSeconds <= 3.1,
  );
  process.stdout.write("Chat Story MP4 smoke test passed.\n");
} finally {
  await rm(workspace, { recursive: true, force: true });
}
