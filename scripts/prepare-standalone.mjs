import { cp, mkdir } from "node:fs/promises";

await Promise.all([
  mkdir(".next/standalone/.next", { recursive: true }),
  mkdir(".next/standalone/src/features/tools/model", { recursive: true }),
]);
await Promise.all([
  cp("public", ".next/standalone/public", { recursive: true }),
  cp(".next/static", ".next/standalone/.next/static", { recursive: true }),
  cp("vendor/media-tools", ".next/standalone/vendor/media-tools", {
    recursive: true,
  }),
  cp("src/features/tools/video", ".next/standalone/src/features/tools/video", {
    recursive: true,
  }),
  cp(
    "src/features/tools/model/chat-story.ts",
    ".next/standalone/src/features/tools/model/chat-story.ts",
  ),
]);
