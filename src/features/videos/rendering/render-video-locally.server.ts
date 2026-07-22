import "server-only";

import path from "node:path";
import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";

import type {
  QuickListVideo,
  QuickListVideoProposal,
} from "@/features/videos/model/quick-list-video";
import {
  ensureVideoArtifactDirectory,
  readVideoArtifact,
  resolveVideoArtifact,
  toDataUrl,
  videoRelativeDirectory,
} from "@/features/videos/rendering/local-video-workspace.server";
import { generateVideoNarration } from "@/features/videos/rendering/generate-video-narration.server";

export async function renderVideoLocally(
  projectId: string,
  video: QuickListVideo,
  proposal: QuickListVideoProposal,
) {
  const imageSources = await Promise.all(
    video.assets.map(async (asset) =>
      toDataUrl(asset.contentType, await readVideoArtifact(asset.relativePath)),
    ),
  );
  const audioSources = video.narrationEnabled
    ? await generateVideoNarration({
        projectId,
        videoId: video.videoId,
        locale: video.locale,
        voiceGender: video.voiceGender,
        proposal,
      })
    : [];
  const inputProps = {
    proposal,
    locale: video.locale,
    imageSources,
    audioSources,
  };
  const serveUrl = await bundle({
    entryPoint: path.join(
      process.cwd(),
      "src/features/videos/rendering/remotion-entry.tsx",
    ),
    webpackOverride: (configuration) => ({
      ...configuration,
      resolve: {
        ...configuration.resolve,
        alias: {
          ...(configuration.resolve?.alias ?? {}),
          "@": path.resolve(process.cwd(), "src"),
        },
      },
    }),
  });
  const composition = await selectComposition({
    id: "QuickListVideo",
    inputProps,
    serveUrl,
  });
  const relativeDirectory = videoRelativeDirectory(projectId, video.videoId);
  await ensureVideoArtifactDirectory(path.join(relativeDirectory, "output"));
  const outputPath = path.join(relativeDirectory, "output", "video.mp4");
  const coverPath = path.join(relativeDirectory, "output", "cover.png");
  await renderMedia({
    audioCodec: "aac",
    codec: "h264",
    composition,
    inputProps,
    logLevel: "warn",
    outputLocation: resolveVideoArtifact(outputPath),
    overwrite: true,
    serveUrl,
  });
  await renderStill({
    composition,
    frame: 30,
    imageFormat: "png",
    inputProps,
    logLevel: "warn",
    output: resolveVideoArtifact(coverPath),
    overwrite: true,
    serveUrl,
  });
  return { outputPath, coverPath };
}
