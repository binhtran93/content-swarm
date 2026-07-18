"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { archiveArticle } from "@/features/articles/publishing/archive-article.server";
import { publishArticle } from "@/features/articles/publishing/publish-article.server";
import { approveTranslation } from "@/features/articles/service/approve-translation.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { createArticle } from "@/features/articles/service/create-article.server";
import { generateArticleBrief } from "@/features/articles/service/generate-article-brief.server";
import { generateArticleContent } from "@/features/articles/service/generate-article-content.server";
import { generateArticleOutline } from "@/features/articles/service/generate-article-outline.server";
import { generateTranslation } from "@/features/articles/service/generate-translation.server";
import { improveArticleContent } from "@/features/articles/service/improve-article-content.server";
import { saveArticleBrief } from "@/features/articles/service/save-article-brief.server";
import { saveArticleContent } from "@/features/articles/service/save-article-content.server";
import { saveArticleOutline } from "@/features/articles/service/save-article-outline.server";
import { saveArticleSeo } from "@/features/articles/service/save-article-seo.server";
import { saveTranslation } from "@/features/articles/service/save-translation.server";

export type ArticleActionState = {
  error?: string;
  saved?: boolean;
  proposal?: Record<string, string>;
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
  redirect(`/admin/projects/${projectId}/articles/${articleId}?step=brief`);
}

export async function saveBriefAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    await saveArticleBrief(
      projectId,
      articleId,
      String(formData.get("brief") ?? ""),
    );
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function generateBriefAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    return {
      proposal: { brief: await generateArticleBrief(projectId, articleId) },
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function saveOutlineAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    await saveArticleOutline(
      projectId,
      articleId,
      String(formData.get("outline") ?? ""),
      String(formData.get("title") ?? ""),
    );
    revalidatePath(`/admin/projects/${projectId}/articles/${articleId}`);
    return { saved: true };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function generateOutlineAction(
  _state: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const { projectId, articleId } = ids(formData);
  try {
    const proposal = await generateArticleOutline(projectId, articleId);
    return {
      proposal: { title: proposal.title, outline: proposal.outlineMarkdown },
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
    return {
      proposal: { content: await generateArticleContent(projectId, articleId) },
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
    return {
      proposal: { content: await improveArticleContent(projectId, articleId) },
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
