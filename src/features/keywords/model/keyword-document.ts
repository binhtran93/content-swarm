import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const keywordDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  keyword: z.string().min(1).max(200),
  normalizedKeyword: z.string().min(1).max(200),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  languageCode: z.string().regex(/^[a-z]{2,3}$/),
  searchVolume: z.number().int().nonnegative().nullable(),
  difficulty: z.number().min(0).max(100).nullable(),
  sourceDiscoveryId: z.string().min(1).nullable(),
  groupId: z.string().min(1).nullable(),
  articleId: z.string().min(1).nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});
