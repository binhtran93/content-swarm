import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import {
  defaultProjectAcquisition,
  projectAcquisitionSchema,
} from "@/features/projects/model/project-acquisition";
import { competitorDomainsSchema } from "@/features/projects/model/competitor-domain";

const topics = z
  .array(z.string().min(1).max(80))
  .max(100)
  .refine(
    (values) =>
      new Set(values.map((value) => value.toLocaleLowerCase())).size ===
      values.length,
  );

export const projectDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  ownerId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(5_000),
  topics,
  competitorDomains: competitorDomainsSchema.default([]),
  acquisition: projectAcquisitionSchema.default(defaultProjectAcquisition),
  status: z.enum(["active", "archived"]),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
  archivedAt: z.instanceof(Timestamp).nullable(),
});
