import "server-only";

import { z } from "zod";
import { articleMdxComponentDescriptions } from "@/features/articles/config/article-mdx-components";
import { articleTranslationPrompt } from "@/features/articles/prompts/article-translation-prompt";
import { generateArticleAi } from "@/features/articles/provider/generate-article-ai.server";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";
import { getArticleGenerationContext } from "@/features/articles/service/get-article-generation-context.server";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";

const outputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(500_000),
  seoTitle: z.string().trim().min(1).max(200),
  seoDescription: z.string().trim().min(1).max(500),
});

export async function generateTranslation(
  projectId: string,
  articleId: string,
  locale: string,
) {
  const context = await getArticleGenerationContext(projectId, articleId);
  const source = context.article;
  if (
    !source.title ||
    !source.excerpt ||
    !source.content ||
    !source.seoTitle ||
    !source.seoDescription
  )
    throw new ArticleServiceError(
      "invalid",
      "Complete and save the source article before translation.",
    );
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(locale) || locale === source.locale)
    throw new ArticleServiceError(
      "invalid",
      "Choose a different valid target locale.",
    );
  const result = await generateArticleAi(
    articleTranslationPrompt.system,
    JSON.stringify({
      project: {
        name: context.project.name,
        description: context.project.description,
      },
      sourceLocale: source.locale,
      targetLocale: locale,
      source: {
        title: source.title,
        excerpt: source.excerpt,
        content: source.content,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
      },
      approvedComponents: articleMdxComponentDescriptions,
    }),
    {
      format: {
        name: "article_translation",
        schema: outputSchema,
      },
      searchGrounding: false,
    },
  );
  const proposal = result.output;
  const validation = validateArticleMdx(proposal.content);
  if (!validation.valid)
    throw new ArticleServiceError(
      "provider",
      `AI returned invalid MDX: ${validation.errors[0]}`,
    );
  return proposal;
}
