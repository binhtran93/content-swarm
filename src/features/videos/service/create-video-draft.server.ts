import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { Timestamp } from "firebase-admin/firestore";

import {
  createQuickListVideoInputSchema,
  type CreateQuickListVideoInput,
  type QuickListVideo,
  type VideoAsset,
} from "@/features/videos/model/quick-list-video";
import { videoDocumentSchema } from "@/features/videos/model/video-document";
import {
  videoRelativeDirectory,
  writeVideoArtifact,
} from "@/features/videos/rendering/local-video-workspace.server";
import { toVideo } from "@/features/videos/service/to-video.server";
import { VideoServiceError } from "@/features/videos/service/video-service-error";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

const maximumImageBytes = 5 * 1024 * 1024;

function extension(contentType: string) {
  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  throw new VideoServiceError("invalid", "Upload JPEG or PNG images only.");
}

async function saveAssets(
  projectId: string,
  videoId: string,
  files: File[],
): Promise<VideoAsset[]> {
  if (files.length > 3)
    throw new VideoServiceError("invalid", "Upload no more than three images.");

  return Promise.all(
    files.map(async (file) => {
      if (file.size <= 0 || file.size > maximumImageBytes)
        throw new VideoServiceError(
          "invalid",
          "Each image must be no larger than 5 MB.",
        );
      const assetId = randomUUID();
      const contentType = file.type;
      const relativePath = path.join(
        videoRelativeDirectory(projectId, videoId),
        "inputs",
        `${assetId}${extension(contentType)}`,
      );
      await writeVideoArtifact(
        relativePath,
        new Uint8Array(await file.arrayBuffer()),
      );
      return { assetId, contentType, relativePath } as VideoAsset;
    }),
  );
}

export async function createVideoDraft(
  projectId: string,
  values: CreateQuickListVideoInput,
  files: File[],
): Promise<QuickListVideo> {
  await getProjectContext(projectId);
  const input = createQuickListVideoInputSchema.parse(values);
  const reference = getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("videos")
    .doc();
  const assets = await saveAssets(projectId, reference.id, files);
  const now = Timestamp.now();
  const document = videoDocumentSchema.parse({
    schemaVersion: 1,
    ...input,
    assets,
    approvedProposal: null,
    status: "draft",
    outputPath: null,
    coverPath: null,
    lastError: null,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(document);
  return toVideo(reference.id, document);
}
