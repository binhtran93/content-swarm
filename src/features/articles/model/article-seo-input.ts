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
  title: z.string().trim().min(1, "Enter a title.").max(200),
  slug,
  topic: z.string().trim().min(1, "Enter a topic.").max(300),
  excerpt: z.string().trim().min(1, "Enter an excerpt.").max(500),
  seoTitle: z.string().trim().min(1, "Enter an SEO title.").max(200),
  seoDescription: z
    .string()
    .trim()
    .min(1, "Enter an SEO description.")
    .max(500),
});

export type ArticleSeoInput = z.infer<typeof articleSeoInputSchema>;
