export type Translation = {
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "approved";
  createdAt: string;
  updatedAt: string;
};

export type TranslationInput = Pick<
  Translation,
  "title" | "slug" | "excerpt" | "content" | "seoTitle" | "seoDescription"
>;
