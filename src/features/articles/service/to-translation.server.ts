import "server-only";

import type { z } from "zod";

import type { translationDocumentSchema } from "@/features/articles/model/translation-document";
import type { Translation } from "@/features/articles/model/translation";

export function toTranslation(
  locale: string,
  document: z.infer<typeof translationDocumentSchema>,
): Translation {
  return {
    locale,
    title: document.title,
    slug: document.slug,
    excerpt: document.excerpt,
    content: document.content,
    seoTitle: document.seoTitle,
    seoDescription: document.seoDescription,
    status: document.status,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
  };
}
