import "server-only";

import type { ArticleReference } from "@/features/articles/model/article-reference";
import { articleReferencesSchema } from "@/features/articles/model/article-reference";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

export async function saveArticleContent(
  projectId: string,
  articleId: string,
  content: string,
  references: ArticleReference[],
): Promise<void> {
  const value = content.trim();
  const validation = validateArticleMdx(value);
  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);
  await updateArticle(projectId, articleId, (article) => {
    if (!article.plan || !article.title)
      throw new ArticleServiceError(
        "invalid",
        "Save the article plan and title before content.",
      );
    return {
      content: value,
      contentReferences: articleReferencesSchema.parse(references),
    };
  });
}
