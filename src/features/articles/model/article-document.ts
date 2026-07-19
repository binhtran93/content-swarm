import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { articleReferencesSchema } from "@/features/articles/model/article-reference";

const storedArticleDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  locale: z.string().trim().min(2).max(35),
  keywordId: z.string().min(1),
  title: z.string().trim().min(1).max(200).nullable(),
  slug: z.string().trim().min(1).max(160).nullable(),
  topic: z.string().trim().min(1).max(300).nullable(),
  excerpt: z.string().trim().min(1).max(500).nullable(),
  plan: z.string().trim().min(1).max(40_000).nullable().optional(),
  planReferences: articleReferencesSchema.optional(),
  content: z.string().trim().min(1).max(500_000).nullable(),
  contentReferences: articleReferencesSchema.optional(),
  seoTitle: z.string().trim().min(1).max(200).nullable(),
  seoDescription: z.string().trim().min(1).max(500).nullable(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),

  // Read-only compatibility for articles created before Article plan existed.
  brief: z.string().trim().min(1).max(20_000).nullable().optional(),
  outline: z.string().trim().min(1).max(30_000).nullable().optional(),
});

export const articleDocumentSchema = storedArticleDocumentSchema.transform(
  ({ brief, outline, ...document }) => {
    const legacyPlan = [brief, outline].filter(Boolean).join("\n\n---\n\n");

    return {
      ...document,
      plan: (document.plan ?? legacyPlan) || null,
      planReferences: document.planReferences ?? [],
      contentReferences: document.contentReferences ?? [],
    };
  },
);
