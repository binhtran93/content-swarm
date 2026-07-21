import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(160)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase URL-safe words separated by hyphens.",
  );

export const articleSeoInputSchema = z.object({
  slug,
  topics: z
    .array(z.string().trim().min(1).max(80))
    .max(20, "Use no more than 20 topics.")
    .superRefine((values, context) => {
      const normalized = values.map((value) => value.toLocaleLowerCase());

      if (new Set(normalized).size !== normalized.length)
        context.addIssue({
          code: "custom",
          message: "Topics must be unique, ignoring capitalization.",
        });
    }),
  seoTitle: z.string().trim().min(1, "Enter an SEO title.").max(200),
  seoDescription: z
    .string()
    .trim()
    .min(1, "Enter an SEO description.")
    .max(500),
});

export type ArticleSeoInput = z.infer<typeof articleSeoInputSchema>;
