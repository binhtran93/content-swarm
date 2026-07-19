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

export function assertApplicableContentChanges(
  content: string,
  changes: ArticleContentChange[],
): void {
  const ranges = changes.map((change) => {
    const start = content.indexOf(change.before);

    if (start < 0)
      throw new Error("A proposed passage no longer exists in the content.");

    if (content.indexOf(change.before, start + 1) >= 0)
      throw new Error("A proposed passage is not unique in the content.");

    return { start, end: start + change.before.length };
  });

  const ordered = ranges.toSorted((left, right) => left.start - right.start);

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index]!.start < ordered[index - 1]!.end)
      throw new Error("Proposed content changes overlap.");
  }
}
