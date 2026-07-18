import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const discoveryMethodSchema = z.enum([
  "keyword_ideas",
  "related_keywords",
  "competitor_website",
]);

export const discoveryResultSchema = z.object({
  keyword: z.string().min(1).max(200),
  searchVolume: z.number().int().nonnegative().nullable(),
  difficulty: z.number().min(0).max(100).nullable(),
  rank: z.number().int().positive().nullable(),
});

export const keywordDiscoveryDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  requestKey: z.string().min(1),
  method: discoveryMethodSchema,
  input: z.string().min(1).max(500),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  languageCode: z.string().regex(/^[a-z]{2,3}$/),
  limit: z.union([
    z.literal(50),
    z.literal(100),
    z.literal(250),
    z.literal(500),
  ]),
  minimumVolume: z.number().int().nonnegative().nullable(),
  maximumDifficulty: z.number().min(0).max(100).nullable(),
  orderBy: z.array(z.string().min(1)).min(1).max(3),
  results: z.array(discoveryResultSchema).max(500),
  createdAt: z.instanceof(Timestamp),
});
