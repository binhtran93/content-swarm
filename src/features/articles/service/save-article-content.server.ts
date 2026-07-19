import "server-only";

import type { ArticleReference } from "@/features/articles/model/article-reference";
import { articleReferencesSchema } from "@/features/articles/model/article-reference";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { updateArticle } from "@/features/articles/service/update-article.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

export async function saveArticleContent(
  projectId: string,
  articleId: string,
  input: {
    title: string;
    excerpt: string;
    content: string;
    references: ArticleReference[];
  },
): Promise<void> {
  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();

  if (!title || title.length > 200)
    throw new ArticleServiceError("invalid", "Enter an article title.");

  if (!excerpt || excerpt.length > 500)
    throw new ArticleServiceError(
      "invalid",
      "Enter an excerpt up to 500 characters.",
    );

  const validation = validateArticleMdx(content);
  if (!validation.valid)
    throw new ArticleServiceError("invalid", validation.errors[0]!);

  await updateArticle(projectId, articleId, (article) => {
    if (!article.plan)
      throw new ArticleServiceError(
        "invalid",
        "Save the article plan before content.",
      );

    return {
      title,
      excerpt,
      content,
      contentReferences: articleReferencesSchema.parse(input.references),
    };
  });
}
