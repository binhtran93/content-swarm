import { z } from "zod";

export const storyboardJobIdSchema = z.uuid();
export const storyboardJobNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(100, "Use 100 characters or fewer.");

export const storyboardCropConfig = {
  maximumPanels: 200,
  minimumSidePixels: 16,
} as const;

export const panelBoundsSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().min(storyboardCropConfig.minimumSidePixels),
  height: z.number().int().min(storyboardCropConfig.minimumSidePixels),
});

export const storyboardPanelSchema = z.object({
  panelId: z.string().regex(/^panel-\d{2,3}$/),
  fileName: z.string().regex(/^panel-\d{2,3}\.png$/),
  bounds: panelBoundsSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const sourceSchema = z.object({
  originalName: z.string().min(1).max(255),
  contentType: z.enum(["image/jpeg", "image/png"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const commonManifestFields = {
  projectId: z.string().min(1),
  jobId: storyboardJobIdSchema,
  name: storyboardJobNameSchema,
  source: sourceSchema,
  panels: z
    .array(storyboardPanelSchema)
    .max(storyboardCropConfig.maximumPanels),
  panelCount: z.number().int().nonnegative(),
  hasOverlay: z.boolean(),
  hasZip: z.boolean(),
  error: z.string().max(500).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
};

const storyboardJobManifestV1Schema = z.object({
  schemaVersion: z.literal(1),
  ...commonManifestFields,
  status: z.enum(["processing", "ready", "failed"]),
  panels: z
    .array(
      storyboardPanelSchema.extend({
        bounds: z.object({
          x: z.number().int().nonnegative(),
          y: z.number().int().nonnegative(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        }),
      }),
    )
    .max(storyboardCropConfig.maximumPanels),
});

const storyboardJobManifestV2Schema = z.object({
  schemaVersion: z.literal(2),
  ...commonManifestFields,
  status: z.enum(["review", "processing", "ready", "failed"]),
  detectedBounds: z
    .array(panelBoundsSchema)
    .max(storyboardCropConfig.maximumPanels),
  cropBounds: z
    .array(panelBoundsSchema)
    .max(storyboardCropConfig.maximumPanels),
});

export const storyboardJobManifestSchema = z
  .union([storyboardJobManifestV2Schema, storyboardJobManifestV1Schema])
  .transform((manifest) => {
    if (manifest.schemaVersion === 2) return manifest;
    const legacyBounds = manifest.panels.map((panel) => panel.bounds);
    return {
      ...manifest,
      schemaVersion: 2 as const,
      detectedBounds: legacyBounds,
      cropBounds: legacyBounds,
    };
  });

export const storyboardCropBoundsSchema = z
  .array(panelBoundsSchema)
  .min(1, "Keep at least one crop rectangle.")
  .max(storyboardCropConfig.maximumPanels);

export type PanelBounds = z.infer<typeof panelBoundsSchema>;
export type StoryboardPanel = z.infer<typeof storyboardPanelSchema>;
export type StoryboardJobManifest = z.output<
  typeof storyboardJobManifestSchema
>;

export type StoryboardJobSummary = Pick<
  StoryboardJobManifest,
  | "jobId"
  | "name"
  | "status"
  | "panelCount"
  | "error"
  | "createdAt"
  | "updatedAt"
>;
