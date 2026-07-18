import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const translationDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(500_000),
  seoTitle: z.string().trim().min(1).max(200),
  seoDescription: z.string().trim().min(1).max(500),
  status: z.enum(["draft", "approved"]),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});
