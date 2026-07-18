import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const articleDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  locale: z.string().trim().min(2).max(35),
  keywordId: z.string().min(1),
  title: z.string().trim().min(1).max(200).nullable(),
  slug: z.string().trim().min(1).max(160).nullable(),
  topic: z.string().trim().min(1).max(300).nullable(),
  excerpt: z.string().trim().min(1).max(500).nullable(),
  brief: z.string().trim().min(1).max(20_000).nullable(),
  outline: z.string().trim().min(1).max(30_000).nullable(),
  content: z.string().trim().min(1).max(500_000).nullable(),
  seoTitle: z.string().trim().min(1).max(200).nullable(),
  seoDescription: z.string().trim().min(1).max(500).nullable(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});
