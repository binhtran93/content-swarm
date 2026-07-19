import { z } from "zod";

export const articleContentChangeSchema = z
  .object({
    before: z.string().trim().min(1).max(12_000),
    after: z.string().trim().min(1).max(12_000),
  })
  .refine((change) => change.before !== change.after, {
    message: "The proposed content change must be different.",
  });

export const articleContentChangesSchema = z
  .array(articleContentChangeSchema)
  .max(30);

export type ArticleContentChange = z.infer<typeof articleContentChangeSchema>;
