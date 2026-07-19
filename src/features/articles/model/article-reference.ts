import { z } from "zod";

export const articleReferenceSchema = z.object({
  title: z.string().trim().min(1).max(300),
  url: z.url().max(2_048),
});

export const articleReferencesSchema = z
  .array(articleReferenceSchema)
  .max(30)
  .default([]);

export type ArticleReference = z.infer<typeof articleReferenceSchema>;
