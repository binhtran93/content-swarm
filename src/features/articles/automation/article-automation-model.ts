import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const automationStageSchema = z.enum([
  "initialize",
  "plan",
  "content",
  "publish",
]);

export const articleAutomationDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  enabled: z.boolean(),
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timeZone: z.string().min(1).max(100),
  nextRunAt: z.instanceof(Timestamp).nullable(),
  activeArticleId: z.string().min(1).nullable(),
  stage: automationStageSchema.nullable(),
  leaseId: z.string().min(1).nullable(),
  leaseUntil: z.instanceof(Timestamp).nullable(),
  lastStartedAt: z.instanceof(Timestamp).nullable(),
  attemptCount: z.number().int().nonnegative(),
  lastCompletedAt: z.instanceof(Timestamp).nullable(),
  lastError: z.string().max(300).nullable(),
  updatedAt: z.instanceof(Timestamp),
});

export type ArticleAutomationSettings = {
  enabled: boolean;
  localTime: string;
  timeZone: string;
  nextRunAt: string | null;
  activeArticleId: string | null;
  stage: z.infer<typeof automationStageSchema> | null;
  lastCompletedAt: string | null;
  lastError: string | null;
};

export const defaultArticleAutomationSettings: ArticleAutomationSettings = {
  enabled: false,
  localTime: "09:00",
  timeZone: "UTC",
  nextRunAt: null,
  activeArticleId: null,
  stage: null,
  lastCompletedAt: null,
  lastError: null,
};
