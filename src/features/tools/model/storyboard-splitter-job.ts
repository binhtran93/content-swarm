import { z } from "zod";

export const storyboardJobIdSchema = z.uuid();
export const storyboardJobNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(100, "Use 100 characters or fewer.");

export const panelBoundsSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const storyboardPanelSchema = z.object({
  panelId: z.string().regex(/^panel-\d{2,3}$/),
  fileName: z.string().regex(/^panel-\d{2,3}\.png$/),
  bounds: panelBoundsSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const storyboardJobManifestSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  jobId: storyboardJobIdSchema,
  name: storyboardJobNameSchema,
  status: z.enum(["processing", "ready", "failed"]),
  source: z.object({
    originalName: z.string().min(1).max(255),
    contentType: z.enum(["image/jpeg", "image/png"]),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  panels: z.array(storyboardPanelSchema).max(200),
  panelCount: z.number().int().nonnegative(),
  hasOverlay: z.boolean(),
  hasZip: z.boolean(),
  error: z.string().max(500).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type PanelBounds = z.infer<typeof panelBoundsSchema>;
export type StoryboardPanel = z.infer<typeof storyboardPanelSchema>;
export type StoryboardJobManifest = z.infer<typeof storyboardJobManifestSchema>;

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
