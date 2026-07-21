import "server-only";

import { randomUUID } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import type { z } from "zod";

import {
  articleAutomationDocumentSchema,
  type ArticleAutomationSettings,
} from "@/features/articles/automation/article-automation-model";
import { nextScheduledTime } from "@/features/articles/automation/article-automation-schedule";
import { selectAutomationKeyword } from "@/features/articles/automation/article-automation-selection";
import { retryAutomationOperation } from "@/features/articles/automation/retry-automation-operation";
import {
  requireOwner,
  runAsAutomationOwner,
} from "@/features/auth/server/require-owner.server";
import { slugifyArticleTitle } from "@/features/articles/model/article-slug";
import { articleTitleFromKeyword } from "@/features/articles/model/article-title";
import { publishArticle } from "@/features/articles/publishing/publish-article.server";
import { createArticle } from "@/features/articles/service/create-article.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { generateArticleContent } from "@/features/articles/service/generate-article-content.server";
import { generateArticleExcerpt } from "@/features/articles/service/generate-article-excerpt.server";
import { generateArticlePlan } from "@/features/articles/service/generate-article-plan.server";
import { getArticle } from "@/features/articles/service/get-article.server";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { applyArticleContentChanges } from "@/features/articles/service/apply-article-content-changes.server";
import { reviewArticleContent } from "@/features/articles/service/review-article-content.server";
import { saveArticleContent } from "@/features/articles/service/save-article-content.server";
import { saveArticlePlan } from "@/features/articles/service/save-article-plan.server";
import { saveArticleSeo } from "@/features/articles/service/save-article-seo.server";
import { updateArticle } from "@/features/articles/service/update-article.server";
import { listKeywordGroups } from "@/features/keywords/service/list-keyword-groups.server";
import { listKeywords } from "@/features/keywords/service/list-keywords.server";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const leaseMilliseconds = 40 * 60 * 1000;

type Stage = NonNullable<ArticleAutomationSettings["stage"]>;

function sanitizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Automation failed.";
  return message.replace(/[\r\n]+/g, " ").slice(0, 300);
}

function mergeReferences<T extends { url: string }>(...sets: T[][]): T[] {
  return sets
    .flat()
    .filter(
      (reference, index, all) =>
        all.findIndex((item) => item.url === reference.url) === index,
    );
}

async function updateState(
  reference: FirebaseFirestore.DocumentReference,
  leaseId: string,
  values: Record<string, unknown>,
) {
  const firestore = getServerFirestore();
  await firestore.runTransaction(async (transaction) => {
    const current = articleAutomationDocumentSchema.parse(
      (await transaction.get(reference)).data(),
    );
    if (current.leaseId !== leaseId)
      throw new Error("Automation lease expired.");
    transaction.update(reference, { ...values, updatedAt: Timestamp.now() });
  });
}

async function acquireLease(
  reference: FirebaseFirestore.DocumentReference,
  now: Date,
  options: { force?: boolean; ownerId?: string } = {},
): Promise<{
  leaseId: string;
  state: z.infer<typeof articleAutomationDocumentSchema>;
} | null> {
  const firestore = getServerFirestore();
  return firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const state = articleAutomationDocumentSchema.parse(snapshot.data());
    if (
      (!options.force &&
        (!state.enabled ||
          !state.nextRunAt ||
          state.nextRunAt.toMillis() > now.getTime())) ||
      (state.leaseUntil && state.leaseUntil.toMillis() > now.getTime())
    )
      return null;
    const projectSnapshot = await transaction.get(reference.parent.parent!);
    const project = readFirestoreDocument(
      projectDocumentSchema,
      projectSnapshot,
    );
    if (
      !project ||
      project.ownerId !== (options.ownerId ?? DEPLOYED_OWNER_UID) ||
      project.status !== "active"
    )
      return null;
    const leaseId = randomUUID();
    transaction.update(reference, {
      leaseId,
      leaseUntil: Timestamp.fromMillis(now.getTime() + leaseMilliseconds),
      lastStartedAt: Timestamp.fromDate(now),
      attemptCount: state.attemptCount + 1,
      lastError: null,
      updatedAt: Timestamp.now(),
    });
    return { leaseId, state };
  });
}

async function runProject(
  reference: FirebaseFirestore.DocumentReference,
  leaseId: string,
  initialState: z.infer<typeof articleAutomationDocumentSchema>,
): Promise<boolean> {
  const projectId = reference.parent.parent!.id;
  let articleId = initialState.activeArticleId;
  let stage: Stage = initialState.stage ?? "initialize";

  if (!articleId) {
    const [keywords, groups] = await Promise.all([
      listKeywords(projectId),
      listKeywordGroups(projectId),
    ]);
    const keyword = selectAutomationKeyword(keywords, groups);
    if (!keyword) return false;
    const article = await createArticle(projectId, keyword.keywordId);
    articleId = article.articleId;
    stage = "initialize";
    await updateState(reference, leaseId, {
      activeArticleId: articleId,
      stage,
    });
  }

  if (stage === "initialize") {
    const context = await getArticleGenerationContext(projectId, articleId);
    await updateArticle(projectId, articleId, () => ({
      title: articleTitleFromKeyword(context.primaryKeyword),
    }));
    stage = "plan";
    await updateState(reference, leaseId, { stage });
  }

  if (stage === "plan") {
    const plan = await retryAutomationOperation(() =>
      generateArticlePlan(projectId, articleId!),
    );
    await saveArticlePlan(
      projectId,
      articleId,
      plan.output.planMarkdown,
      plan.references,
    );
    stage = "content";
    await updateState(reference, leaseId, { stage });
  }

  if (stage === "content") {
    const generated = await retryAutomationOperation(() =>
      generateArticleContent(projectId, articleId!),
    );
    await updateArticle(projectId, articleId, () => ({
      title: generated.output.title,
    }));
    const review = await retryAutomationOperation(() =>
      reviewArticleContent(projectId, articleId!, generated.output.content),
    );
    const improved = review.output.changes.length
      ? await retryAutomationOperation(() =>
          applyArticleContentChanges(
            projectId,
            articleId!,
            generated.output.content,
            review.output.changes,
          ),
        )
      : { output: generated.output.content, references: generated.references };
    const excerpt = await retryAutomationOperation(() =>
      generateArticleExcerpt(projectId, articleId!, improved.output),
    );
    const article = await getArticle(projectId, articleId);
    await saveArticleContent(projectId, articleId, {
      title: article.title ?? "",
      excerpt: excerpt.output.excerpt,
      content: improved.output,
      references: mergeReferences(
        generated.references,
        review.references,
        improved.references,
      ),
    });
    const title = article.title ?? "";
    const generatedSlug = slugifyArticleTitle(title);
    const seo = {
      slug:
        generatedSlug || `article-${articleId.slice(0, 8).toLocaleLowerCase()}`,
      topics: [],
      seoTitle: title,
      seoDescription: excerpt.output.excerpt,
    };
    try {
      await saveArticleSeo(projectId, articleId, seo);
    } catch (error) {
      if (!(error instanceof ArticleServiceError) || error.code !== "conflict")
        throw error;
      const suffix = articleId.slice(0, 8).toLocaleLowerCase();
      const base = seo.slug.slice(0, 151).replace(/-+$/g, "");
      await saveArticleSeo(projectId, articleId, {
        ...seo,
        slug: `${base}-${suffix}`,
      });
    }
    stage = "publish";
    await updateState(reference, leaseId, { stage });
  }

  await publishArticle(projectId, articleId);
  return true;
}

async function finish(
  reference: FirebaseFirestore.DocumentReference,
  leaseId: string,
  state: z.infer<typeof articleAutomationDocumentSchema>,
  completed: boolean,
  error?: unknown,
) {
  await updateState(reference, leaseId, {
    activeArticleId: completed ? null : state.activeArticleId,
    stage: completed ? null : state.stage,
    leaseId: null,
    leaseUntil: null,
    lastCompletedAt: completed ? Timestamp.now() : state.lastCompletedAt,
    lastError: error ? sanitizeError(error) : null,
    nextRunAt: state.enabled
      ? Timestamp.fromDate(
          nextScheduledTime(new Date(), state.localTime, state.timeZone),
        )
      : null,
  });
}

export async function runDueArticleAutomations(now = new Date()) {
  const firestore = getServerFirestore();
  const snapshot = await firestore
    .collectionGroup("automation")
    .where("enabled", "==", true)
    .where("nextRunAt", "<=", Timestamp.fromDate(now))
    .get();
  let completed = 0;
  let failed = 0;

  for (const document of snapshot.docs.filter(
    (item) => item.id === "articlePublishing",
  )) {
    const lease = await acquireLease(document.ref, now);
    if (!lease) continue;
    try {
      const processed = await runAsAutomationOwner(() =>
        runProject(document.ref, lease.leaseId, lease.state),
      );
      const latest = articleAutomationDocumentSchema.parse(
        (await document.ref.get()).data(),
      );
      await finish(document.ref, lease.leaseId, latest, true);
      if (processed) completed += 1;
    } catch (error) {
      const latest = articleAutomationDocumentSchema.parse(
        (await document.ref.get()).data(),
      );
      await finish(document.ref, lease.leaseId, latest, false, error);
      failed += 1;
    }
  }
  return { completed, failed };
}

export async function runArticleAutomationNow(
  projectId: string,
): Promise<"published" | "empty" | "busy"> {
  const owner = await requireOwner();
  const firestore = getServerFirestore();
  const projectReference = firestore.collection("projects").doc(projectId);
  const reference = projectReference
    .collection("automation")
    .doc("articlePublishing");
  const now = new Date();

  await firestore.runTransaction(async (transaction) => {
    const [projectSnapshot, settingsSnapshot] = await Promise.all([
      transaction.get(projectReference),
      transaction.get(reference),
    ]);
    const project = readFirestoreDocument(
      projectDocumentSchema,
      projectSnapshot,
    );
    if (
      !project ||
      project.ownerId !== owner.uid ||
      project.status !== "active"
    )
      throw new Error("Project is unavailable.");
    if (!settingsSnapshot.exists)
      transaction.create(
        reference,
        articleAutomationDocumentSchema.parse({
          schemaVersion: 1,
          enabled: false,
          localTime: "09:00",
          timeZone: "UTC",
          nextRunAt: null,
          activeArticleId: null,
          stage: null,
          leaseId: null,
          leaseUntil: null,
          lastStartedAt: null,
          attemptCount: 0,
          lastCompletedAt: null,
          lastError: null,
          updatedAt: Timestamp.now(),
        }),
      );
  });

  const lease = await acquireLease(reference, now, {
    force: true,
    ownerId: owner.uid,
  });
  if (!lease) return "busy";
  try {
    const processed = await runAsAutomationOwner(() =>
      runProject(reference, lease.leaseId, lease.state),
    );
    const latest = articleAutomationDocumentSchema.parse(
      (await reference.get()).data(),
    );
    await finish(reference, lease.leaseId, latest, processed);
    return processed ? "published" : "empty";
  } catch (error) {
    const latest = articleAutomationDocumentSchema.parse(
      (await reference.get()).data(),
    );
    await finish(reference, lease.leaseId, latest, false, error);
    throw error;
  }
}
