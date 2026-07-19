import { z } from "zod";

import {
  defaultProjectAcquisition,
  projectAcquisitionSchema,
} from "@/features/projects/model/project-acquisition";

const projectId = z
  .string()
  .trim()
  .min(1, "Project ID is required.")
  .max(63, "Project ID must be 63 characters or fewer.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only.",
  );

const topics = z
  .array(z.string().trim().min(1).max(80))
  .max(100, "Use no more than 100 topics.")
  .superRefine((values, context) => {
    const normalized = values.map((value) => value.toLocaleLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      context.addIssue({
        code: "custom",
        message: "Topics must be unique, ignoring capitalization.",
      });
    }
  });

const fields = {
  name: z.string().trim().min(1, "Name is required.").max(100),
  description: z.string().trim().max(5_000),
};

export const projectInputSchemas = {
  projectId,
  create: z.object({
    projectId,
    ...fields,
    topics: topics.default([]),
    acquisition: projectAcquisitionSchema.default(defaultProjectAcquisition),
  }),
  update: z.object({
    ...fields,
    topics,
    acquisition: projectAcquisitionSchema,
  }),
};
