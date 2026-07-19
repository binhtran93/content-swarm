"use server";

import { redirect } from "next/navigation";

import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { deleteArticle } from "@/features/articles/service/delete-article.server";

type DeleteArticleActionState = { error: string } | null;

export async function deleteArticleAction(
  projectId: string,
  articleId: string,
  _previousState: DeleteArticleActionState,
  _formData: FormData,
): Promise<DeleteArticleActionState> {
  void _previousState;
  void _formData;
  try {
    await deleteArticle(projectId, articleId);
  } catch (error) {
    if (error instanceof ArticleServiceError) return { error: error.message };
    return { error: "The article could not be deleted. Please try again." };
  }

  redirect(`/admin/projects/${projectId}/articles`);
}
