import { findSupportedLocale } from "@/config/supported-locales";
import { ArticleServiceError } from "@/features/articles/service/article-service-error";

export function assertSupportedTranslationLocales(
  sourceLocale: string,
  targetLocale: string,
) {
  if (!findSupportedLocale(sourceLocale))
    throw new ArticleServiceError(
      "invalid",
      "This article's source locale is no longer supported.",
    );

  if (!findSupportedLocale(targetLocale) || targetLocale === sourceLocale)
    throw new ArticleServiceError(
      "invalid",
      "Choose a different supported target locale.",
    );
}
