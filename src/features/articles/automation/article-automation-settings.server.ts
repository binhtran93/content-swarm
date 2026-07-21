import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import {
  articleAutomationDocumentSchema,
  defaultArticleAutomationSettings,
  type ArticleAutomationSettings,
} from "@/features/articles/automation/article-automation-model";
import {
  assertTimeZone,
  nextScheduledTime,
} from "@/features/articles/automation/article-automation-schedule";
import { requireOwner } from "@/features/auth/server/require-owner.server";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const inputSchema = z.object({
  enabled: z.boolean(),
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timeZone: z.string().trim().min(1).max(100),
});

function settingsReference(projectId: string) {
  return getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("automation")
    .doc("articlePublishing");
}

function toSettings(
  value: z.infer<typeof articleAutomationDocumentSchema>,
): ArticleAutomationSettings {
  return {
    enabled: value.enabled,
    localTime: value.localTime,
    timeZone: value.timeZone,
    nextRunAt: value.nextRunAt?.toDate().toISOString() ?? null,
    activeArticleId: value.activeArticleId,
    stage: value.stage,
    lastCompletedAt: value.lastCompletedAt?.toDate().toISOString() ?? null,
    lastError: value.lastError,
  };
}

export async function getArticleAutomationSettings(
  projectId: string,
): Promise<ArticleAutomationSettings> {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const [projectSnapshot, settingsSnapshot] = await Promise.all([
    firestore.collection("projects").doc(projectId).get(),
    settingsReference(projectId).get(),
  ]);
  const project = readFirestoreDocument(projectDocumentSchema, projectSnapshot);
  if (!project || project.ownerId !== owner.uid)
    throw new ProjectServiceError("unavailable", "Project is unavailable.");
  if (!settingsSnapshot.exists) return defaultArticleAutomationSettings;
  return toSettings(
    articleAutomationDocumentSchema.parse(settingsSnapshot.data()),
  );
}

export async function updateArticleAutomationSettings(
  projectId: string,
  input: z.input<typeof inputSchema>,
): Promise<ArticleAutomationSettings> {
  const owner = await requireOwner();
  const value = inputSchema.parse(input);
  const timeZone = assertTimeZone(value.timeZone);
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const reference = settingsReference(projectId);
  const now = new Date();

  const document = await firestore.runTransaction(async (transaction) => {
    const [projectSnapshot, currentSnapshot] = await Promise.all([
      transaction.get(projectReference),
      transaction.get(reference),
    ]);
    const project = readFirestoreDocument(
      projectDocumentSchema,
      projectSnapshot,
    );
    if (!project || project.ownerId !== owner.uid)
      throw new ProjectServiceError("unavailable", "Project is unavailable.");
    if (project.status !== "active")
      throw new ProjectServiceError(
        "archived",
        "Archived projects cannot be changed.",
      );
    const current = currentSnapshot.exists
      ? articleAutomationDocumentSchema.parse(currentSnapshot.data())
      : null;
    const next = articleAutomationDocumentSchema.parse({
      schemaVersion: 1,
      enabled: value.enabled,
      localTime: value.localTime,
      timeZone,
      nextRunAt: value.enabled
        ? Timestamp.fromDate(nextScheduledTime(now, value.localTime, timeZone))
        : null,
      activeArticleId: current?.activeArticleId ?? null,
      stage: current?.stage ?? null,
      leaseId: current?.leaseId ?? null,
      leaseUntil: current?.leaseUntil ?? null,
      lastStartedAt: current?.lastStartedAt ?? null,
      attemptCount: current?.attemptCount ?? 0,
      lastCompletedAt: current?.lastCompletedAt ?? null,
      lastError: current?.lastError ?? null,
      updatedAt: Timestamp.now(),
    });
    transaction.set(reference, next);
    return next;
  });
  return toSettings(document);
}
