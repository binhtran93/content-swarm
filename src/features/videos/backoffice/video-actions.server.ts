"use server";

import { spawn } from "node:child_process";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import {
  createQuickListVideoInputSchema,
  quickListVideoProposalSchema,
  type QuickListVideoProposal,
  type VideoAsset,
} from "@/features/videos/model/quick-list-video";
import { resolveVideoArtifact } from "@/features/videos/rendering/local-video-workspace.server";
import { approveAndRenderVideo } from "@/features/videos/service/approve-and-render-video.server";
import { createVideoDraft } from "@/features/videos/service/create-video-draft.server";
import { generateVideoProposal } from "@/features/videos/service/generate-video-proposal.server";
import { getVideo } from "@/features/videos/service/get-video.server";
import { VideoServiceError } from "@/features/videos/service/video-service-error";

export type VideoCreatorActionState = {
  error?: string;
  videoId?: string;
  assets?: VideoAsset[];
  proposal?: QuickListVideoProposal;
} | null;

function message(error: unknown) {
  if (error instanceof ZodError)
    return error.issues[0]?.message ?? "Check the video details.";
  if (error instanceof VideoServiceError) return error.message;
  return "The video could not be changed. Please try again.";
}

function booleanValue(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function uploadedImages(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function generateVideoStoryboardAction(
  _state: VideoCreatorActionState,
  formData: FormData,
): Promise<VideoCreatorActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  try {
    const input = createQuickListVideoInputSchema.parse({
      prompt: formData.get("prompt"),
      sourceMode: formData.get("sourceMode"),
      locale: formData.get("locale"),
      narrationEnabled: booleanValue(formData.get("narrationEnabled")),
      voiceGender: formData.get("voiceGender"),
    });
    const images = uploadedImages(formData);
    const proposal = await generateVideoProposal(
      projectId,
      input,
      images.length,
    );
    const video = await createVideoDraft(projectId, input, images);
    return {
      videoId: video.videoId,
      assets: video.assets,
      proposal,
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function renderVideoAction(
  _state: VideoCreatorActionState,
  formData: FormData,
): Promise<VideoCreatorActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  const videoId = String(formData.get("videoId") ?? "");
  try {
    const proposal = quickListVideoProposalSchema.parse(
      JSON.parse(String(formData.get("proposal") ?? "{}")),
    );
    await approveAndRenderVideo(projectId, videoId, proposal);
  } catch (error) {
    return { error: message(error) };
  }
  redirect(`/admin/projects/${projectId}/videos/${videoId}`);
}

export async function retryVideoAction(projectId: string, videoId: string) {
  const video = await getVideo(projectId, videoId);
  if (!video.approvedProposal)
    throw new VideoServiceError(
      "invalid",
      "Generate and approve a storyboard before rendering.",
    );
  await approveAndRenderVideo(projectId, videoId, video.approvedProposal);
  redirect(`/admin/projects/${projectId}/videos/${videoId}`);
}

export async function openVideoInFinderAction(
  projectId: string,
  videoId: string,
) {
  const video = await getVideo(projectId, videoId);
  if (!video.outputPath)
    throw new VideoServiceError(
      "unavailable",
      "Rendered video is unavailable.",
    );
  if (process.platform !== "darwin")
    throw new VideoServiceError(
      "unavailable",
      "Open in Finder is available on macOS only.",
    );
  const child = spawn("open", ["-R", resolveVideoArtifact(video.outputPath)], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}
