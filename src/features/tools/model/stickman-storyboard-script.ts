import { z } from "zod";

const captionSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .refine(
    (value) => value.split(/\s+/).filter(Boolean).length <= 12,
    "Use 12 words or fewer",
  )
  .refine((value) => !value.endsWith("."), "Do not end captions with a period")
  .refine((value) => !/[—–]/.test(value), "Do not use an em dash or en dash");

export const stickmanStoryboardScriptSchema = z
  .object({
    scenes: z
      .array(
        z
          .object({
            scene: z.number().int().positive(),
            caption: captionSchema,
            visual: z.string().trim().min(1).max(1_000),
          })
          .strict(),
      )
      .min(1),
  })
  .strict()
  .superRefine(({ scenes }, context) => {
    scenes.forEach((scene, index) => {
      if (scene.scene !== index + 1) {
        context.addIssue({
          code: "custom",
          message: "Scene numbers must start at 1 and remain sequential",
          path: ["scenes", index, "scene"],
        });
      }
    });
  });

export type StickmanStoryboardScript = z.infer<
  typeof stickmanStoryboardScriptSchema
>;

export function parseStickmanStoryboardScript(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const json = fenced?.[1] ?? trimmed;
  return stickmanStoryboardScriptSchema.parse(JSON.parse(json));
}
