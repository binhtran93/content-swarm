import { z } from "zod";

import { supportedLocaleSchema } from "@/config/supported-locales";

const shortText = (maximum: number) => z.string().trim().min(1).max(maximum);

export const videoReferenceSchema = z.object({
  title: shortText(300),
  url: z.url(),
});

export const quickListPointSchema = z.object({
  heading: shortText(55),
  body: shortText(130),
  narration: shortText(180),
});

export const quickListVideoProposalSchema = z.object({
  title: shortText(100),
  hook: z.object({
    onScreenText: shortText(80),
    narration: shortText(140),
  }),
  points: z.array(quickListPointSchema).length(3),
  cta: z.object({
    onScreenText: shortText(65),
    narration: shortText(140),
  }),
  coverText: shortText(80),
  caption: shortText(1_000),
  hashtags: z.array(shortText(60)).min(1).max(5),
  musicMood: shortText(100),
  references: z.array(videoReferenceSchema).max(20),
});

export type QuickListVideoProposal = z.infer<
  typeof quickListVideoProposalSchema
>;

export const createQuickListVideoInputSchema = z.object({
  prompt: shortText(2_000),
  sourceMode: z.enum(["project", "free-topic"]),
  locale: supportedLocaleSchema,
  narrationEnabled: z.boolean(),
  voiceGender: z.enum(["NEUTRAL", "FEMALE", "MALE"]),
});

export type CreateQuickListVideoInput = z.infer<
  typeof createQuickListVideoInputSchema
>;

export const videoStatusSchema = z.enum([
  "draft",
  "rendering",
  "ready",
  "failed",
]);

export const videoAssetSchema = z.object({
  assetId: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png"]),
  relativePath: z.string().min(1),
});

export type VideoAsset = z.infer<typeof videoAssetSchema>;

export type QuickListVideo = CreateQuickListVideoInput & {
  videoId: string;
  assets: VideoAsset[];
  approvedProposal: QuickListVideoProposal | null;
  status: z.infer<typeof videoStatusSchema>;
  outputPath: string | null;
  coverPath: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export const quickListTimeline = {
  fps: 30,
  width: 1080,
  height: 1920,
  hookFrames: 90,
  pointFrames: 150,
  ctaFrames: 90,
} as const;

export const quickListDurationFrames =
  quickListTimeline.hookFrames +
  quickListTimeline.pointFrames * 3 +
  quickListTimeline.ctaFrames;
