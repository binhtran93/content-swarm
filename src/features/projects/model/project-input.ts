import { z } from "zod";

const projectId = z
  .string()
  .trim()
  .min(1, "Project ID is required.")
  .max(63, "Project ID must be 63 characters or fewer.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only.",
  );

const canonicalBaseUrl = z
  .union([z.string(), z.null()])
  .transform((value) => (typeof value === "string" ? value.trim() : value))
  .refine((value) => {
    if (value === null || value === "") return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !value.endsWith("/");
    } catch {
      return false;
    }
  }, "Enter an absolute HTTPS URL without a trailing slash.")
  .transform((value) => (value === "" ? null : value));

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
  canonicalBaseUrl,
};

export const projectInputSchemas = {
  projectId,
  create: z.object({
    projectId,
    ...fields,
    topics: topics.default([]),
  }),
  update: z.object({
    ...fields,
    topics,
  }),
};
