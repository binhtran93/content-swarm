import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const keywordGroupDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().trim().min(1).max(100).nullable(),
  primaryKeywordId: z.string().min(1),
  memberKeywordIds: z.array(z.string().min(1)).min(2).max(25),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});
