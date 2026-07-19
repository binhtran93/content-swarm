import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { ArticleWorkspace } from "@/features/articles/backoffice/article-workspace";
import { ArticlePublishPreview } from "@/features/articles/backoffice/publishing/article-publish-preview";
import { getArticle } from "@/features/articles/service/get-article.server";
import { getArticleReadiness } from "@/features/articles/service/get-article-readiness.server";
import { listTranslations } from "@/features/articles/service/list-translations.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

type Step =
  "brief" | "outline" | "content" | "seo" | "translations" | "publish";
function firstIncomplete(
  article: Awaited<ReturnType<typeof getArticle>>,
): Step {
  if (!article.brief) return "brief";
  if (!article.outline || !article.title) return "outline";
  if (!article.content) return "content";
  if (
    !article.slug ||
    !article.topic ||
    !article.excerpt ||
    !article.seoTitle ||
    !article.seoDescription
  )
    return "seo";
  return "publish";
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; articleId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ projectId, articleId }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  let data: Awaited<ReturnType<typeof load>> | null = null;
  try {
    data = await load(projectId, articleId);
  } catch {}
  if (!data)
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PageTitle title="Article unavailable" />
        <Link
          className="btn btn-sm"
          href={`/admin/projects/${projectId}/articles`}
        >
          Back to articles
        </Link>
      </div>
    );
  const { project, article, translations, readiness } = data;
  const requested = Array.isArray(query.step) ? query.step[0] : query.step;
  const valid = [
    "brief",
    "outline",
    "content",
    "seo",
    "translations",
    "publish",
  ].includes(requested ?? "")
    ? (requested as Step)
    : firstIncomplete(article);
  const step =
    (valid === "outline" && !article.brief) ||
    (valid === "content" && (!article.outline || !article.title)) ||
    (valid === "seo" && !article.content)
      ? firstIncomplete(article)
      : valid;
  const preview =
    step === "publish" ? (
      <ArticlePublishPreview
        article={article}
        canonicalBaseUrl={project.canonicalBaseUrl}
        projectId={projectId}
        readiness={readiness}
        translations={translations}
      />
    ) : undefined;
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageTitle
        title={article.title ?? "Untitled article"}
        action={
          <Link
            className="btn btn-ghost btn-sm"
            href={`/admin/projects/${projectId}/articles`}
          >
            All articles
          </Link>
        }
      />
      <ArticleWorkspace
        article={article}
        canonicalBaseUrl={project.canonicalBaseUrl}
        projectId={projectId}
        publishPreview={preview}
        step={step}
        translations={translations}
      />
    </div>
  );
}

async function load(projectId: string, articleId: string) {
  const [project, article, translations, readiness] = await Promise.all([
    getProjectContext(projectId),
    getArticle(projectId, articleId),
    listTranslations(projectId, articleId),
    getArticleReadiness(projectId, articleId),
  ]);
  return { project, article, translations, readiness };
}
