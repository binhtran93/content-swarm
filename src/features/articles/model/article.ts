import type { ArticleReference } from "@/features/articles/model/article-reference";

export type ArticleStatus = "draft" | "published" | "archived";

export type Article = {
  articleId: string;
  locale: string;
  keywordId: string;
  title: string | null;
  slug: string | null;
  topic: string | null;
  excerpt: string | null;
  plan: string | null;
  planReferences: ArticleReference[];
  content: string | null;
  contentReferences: ArticleReference[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
};
