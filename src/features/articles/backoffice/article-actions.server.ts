"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { archiveArticle } from "@/features/articles/publishing/archive-article.server";
import { publishArticle } from "@/features/articles/publishing/publish-article.server";
import {
  articleReferencesSchema,
  type ArticleReference,
} from "@/features/articles/model/article-reference";
import { approveTranslation } from "@/features/articles/service/approve-translation.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { createArticle } from "@/features/articles/service/create-article.server";
import { generateArticleContent } from "@/features/articles/service/generate-article-content.server";
import { generateArticlePlan } from "@/features/articles/service/generate-article-plan.server";
import { generateTranslation } from "@/features/articles/service/generate-translation.server";
import { improveArticleContent } from "@/features/articles/service/improve-article-content.server";
import { saveArticleContent } from "@/features/articles/service/save-article-content.server";
import { saveArticlePlan } from "@/features/articles/service/save-article-plan.server";
import { saveArticleSeo } from "@/features/articles/service/save-article-seo.server";
import { saveTranslation } from "@/features/articles/service/save-translation.server";

export type ArticleActionState = {
  error?: string;
  saved?: boolean;
  proposal?: {
    content?: string;
    excerpt?: string;
    plan?: string;
    references?: ArticleReference[];
    seoDescription?: string;
    seoTitle?: string;
    slug?: string;
    title?: string;
  };
} | null;

function message(error: unknown) {
  if (error instanceof ZodError)
    return error.issues[0]?.message ?? "Check the form values.";
  if (error instanceof ArticleServiceError) return error.message;
  return "The article could not be changed. Please try again.";
}

function ids(formData: FormData) {
  return {
    projectId: String(formData.get("projectId") ?? ""),
    articleId: String(formData.get("articleId") ?? ""),
  };
}

function references(formData: FormData): ArticleReference[] {
  const value = String(formData.get("references") ?? "[]");

  return articleReferencesSchema.parse(JSON.parse(value));
}

export async function createArticleAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  let articleId: string;
  try {
    const article = await createArticle(
      projectId,
      String(formData.get("keywordId") ?? ""),
      String(formData.get("locale") ?? ""),
    );
    articleId = article.articleId;
  } catch (error) {
    return { error: message(error) };
  }
  redirect(`/admin/projects/${projectId}/articles/${articleId}?step=plan`);
}

export async function savePlanAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    await saveArticlePlan(
      projectId,
      articleId,
      String(formData.get("plan") ?? ""),
      String(formData.get("title") ?? ""),
      references(formData),
    );
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function generatePlanAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    const result = await generateArticlePlan(projectId, articleId);

    return {
      proposal: {
        title: result.output.title,
        plan: result.output.planMarkdown,
        references: result.references,
      },
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function saveContentAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    await saveArticleContent(
      projectId,
      articleId,
      String(formData.get("content") ?? ""),
      references(formData),
    );
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function generateContentAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    const result = await generateArticleContent(projectId, articleId);

    return {
      proposal: {
        content: result.output,
        references: result.references,
      },
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function improveContentAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    const result = await improveArticleContent(projectId, articleId);

    return {
      proposal: {
        content: result.output,
        references: result.references,
      },
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function saveSeoAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    await saveArticleSeo(projectId, articleId, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      seoTitle: String(formData.get("seoTitle") ?? ""),
      seoDescription: String(formData.get("seoDescription") ?? ""),
    });
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function saveTranslationAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  const locale = String(formData.get("locale") ?? "");
  try {
    await saveTranslation(projectId, articleId, locale, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      seoTitle: String(formData.get("seoTitle") ?? ""),
      seoDescription: String(formData.get("seoDescription") ?? ""),
    });
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function generateTranslationAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  const locale = String(formData.get("locale") ?? "");
  try {
    return {
      proposal: await generateTranslation(projectId, articleId, locale),
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function approveTranslationAction(formData: FormData) {
  const { projectId, articleId } = ids(formData);
  await approveTranslation(
    projectId,
    articleId,
    String(formData.get("locale") ?? ""),
  );
  redirect(
    `/admin/projects/${projectId}/articles/${articleId}?step=translations`,
  );
}

export async function publishArticleAction(formData: FormData) {
  const { projectId, articleId } = ids(formData);
  await publishArticle(projectId, articleId);
  redirect(`/admin/projects/${projectId}/articles/${articleId}?step=publish`);
}

export async function archiveArticleAction(formData: FormData) {
  const { projectId, articleId } = ids(formData);
  await archiveArticle(projectId, articleId);
  redirect(`/admin/projects/${projectId}/articles`);
}
