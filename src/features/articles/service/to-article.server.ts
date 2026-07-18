import "server-only";

import type { z } from "zod";

import type { articleDocumentSchema } from "@/features/articles/model/article-document";
import type { Article } from "@/features/articles/model/article";

export function toArticle(
  articleId: string,
  document: z.infer<typeof articleDocumentSchema>,
): Article {
  return {
    articleId,
    locale: document.locale,
    keywordId: document.keywordId,
    title: document.title,
    slug: document.slug,
    topic: document.topic,
    excerpt: document.excerpt,
    brief: document.brief,
    outline: document.outline,
    content: document.content,
    seoTitle: document.seoTitle,
    seoDescription: document.seoDescription,
    status: document.status,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
