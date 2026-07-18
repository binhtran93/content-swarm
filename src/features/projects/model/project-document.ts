import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

const canonicalBaseUrl = z.string().refine((value) => {
  try {
    return (
      new URL(value).protocol === "https:" &&
      value.trim() === value &&
      !value.endsWith("/")
    );
  } catch {
    return false;
  }
});

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
  description: z.string().min(1).max(5_000),
  topics,
  canonicalBaseUrl: canonicalBaseUrl.nullable(),
  status: z.enum(["active", "archived"]),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
  archivedAt: z.instanceof(Timestamp).nullable(),
});
