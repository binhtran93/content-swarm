import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import {
  createQuickListVideoInputSchema,
  quickListVideoProposalSchema,
  videoAssetSchema,
  videoStatusSchema,
} from "@/features/videos/model/quick-list-video";

export const videoDocumentSchema = createQuickListVideoInputSchema.extend({
  schemaVersion: z.literal(1),
  assets: z.array(videoAssetSchema).max(3),
  approvedProposal: quickListVideoProposalSchema.nullable(),
  status: videoStatusSchema,
  outputPath: z.string().min(1).nullable(),
  coverPath: z.string().min(1).nullable(),
  lastError: z.string().max(300).nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});
