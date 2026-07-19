import type { Article } from "@/features/articles/model/article";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

export type ArticleReadiness = { ready: boolean; blockers: string[] };

export function evaluateArticleReadiness(
  article: Article,
  context: { keywordAssigned: boolean },
): ArticleReadiness {
  const blockers: string[] = [];

  if (!context.keywordAssigned)
    blockers.push("The primary keyword is no longer assigned to this article.");

  const fields = [
    [article.title, "Title"],
    [article.slug, "Slug"],
    [article.excerpt, "Excerpt"],
    [article.content, "Content"],
    [article.seoTitle, "SEO title"],
    [article.seoDescription, "SEO description"],
  ] as const;
  fields.forEach(([value, label]) => {
    if (!value?.trim()) blockers.push(`${label} is required.`);
  });

  if (!article.topics.length) blockers.push("At least one topic is required.");

  if (article.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))
    blockers.push("Slug is invalid.");

  if (article.content) {
    const validation = validateArticleMdx(article.content);
    if (!validation.valid) blockers.push(...validation.errors);
  }

  return { ready: blockers.length === 0, blockers: [...new Set(blockers)] };
}
