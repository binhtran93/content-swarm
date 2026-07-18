export type ArticleStatus = "draft" | "published" | "archived";

export type Article = {
  articleId: string;
  locale: string;
  keywordId: string;
  title: string | null;
  slug: string | null;
  topic: string | null;
  excerpt: string | null;
  brief: string | null;
  outline: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
};
