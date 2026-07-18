import {
  approveTranslationAction,
  archiveArticleAction,
  publishArticleAction,
} from "@/features/articles/backoffice/article-actions.server";
import type { Article } from "@/features/articles/model/article";
import type { Translation } from "@/features/articles/model/translation";
import type { ArticleReadiness } from "@/features/articles/service/evaluate-article-readiness";
import { validateArticleMdx } from "@/features/articles/service/validate-article-mdx";
import { RenderArticleMdx } from "@/public-site/components/mdx/render-article-mdx.server";

export async function ArticlePublishPreview({
  article,
  canonicalBaseUrl,
  projectId,
  readiness,
  translations,
}: {
  article: Article;
  canonicalBaseUrl: string | null;
  projectId: string;
  readiness: ArticleReadiness;
  translations: Translation[];
}) {
  const contentValid = article.content
    ? validateArticleMdx(article.content).valid
    : false;
  return (
    <div className="space-y-6">
      <div
        className={`alert ${readiness.ready ? "alert-success" : "alert-warning"}`}
      >
        <span>
          {readiness.ready
            ? "This saved article is ready to publish."
            : `${readiness.blockers.length} blocker${readiness.blockers.length === 1 ? "" : "s"} must be resolved before publishing.`}
        </span>
      </div>
      {!readiness.ready ? (
        <ul className="list-disc space-y-1 pl-6 text-sm">
          {readiness.blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      ) : null}
      <div className="rounded-box border-base-300 border p-5">
        <p className="text-base-content/60 text-sm">
          {canonicalBaseUrl && article.slug
            ? `${canonicalBaseUrl}/${article.locale}/blog/${article.slug}`
            : "Public URL unavailable"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {article.title ?? "Untitled"}
        </h1>
        {article.excerpt ? (
          <p className="text-base-content/70 mt-3">{article.excerpt}</p>
        ) : null}
        <div className="prose mt-8 max-w-none">
          {article.content && contentValid ? (
            <RenderArticleMdx content={article.content} />
          ) : (
            <p>
              {article.content
                ? "Saved content is invalid and cannot be previewed."
                : "No saved content."}
            </p>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-medium">Translations</h3>
        {!translations.length ? (
          <p className="text-base-content/60 mt-2 text-sm">
            No translations. This does not block source publication.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {translations.map((translation) => (
              <div
                className="rounded-box border-base-300 flex flex-wrap items-center justify-between gap-3 border p-3"
                key={translation.locale}
              >
                <span>
                  <strong>{translation.locale}</strong> · {translation.title}{" "}
                  <span
                    className={`badge badge-sm ${translation.status === "approved" ? "badge-success" : "badge-ghost"}`}
                  >
                    {translation.status}
                  </span>
                </span>
                {translation.status === "draft" ? (
                  <form action={approveTranslationAction}>
                    <input name="projectId" type="hidden" value={projectId} />
                    <input
                      name="articleId"
                      type="hidden"
                      value={article.articleId}
                    />
                    <input
                      name="locale"
                      type="hidden"
                      value={translation.locale}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        className="checkbox checkbox-sm"
                        required
                        type="checkbox"
                      />
                      Reviewed{" "}
                      <button className="btn btn-sm btn-outline">
                        Approve
                      </button>
                    </label>
                  </form>
                ) : (
                  <span className="text-base-content/60 text-sm">
                    {canonicalBaseUrl
                      ? `${canonicalBaseUrl}/${translation.locale}/blog/${translation.slug}`
                      : translation.slug}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {article.status === "draft" ? (
        <form
          action={publishArticleAction}
          className="rounded-box border-base-300 border p-4"
        >
          <input name="projectId" type="hidden" value={projectId} />
          <input name="articleId" type="hidden" value={article.articleId} />
          <label className="flex items-start gap-3">
            <input
              className="checkbox checkbox-primary mt-1"
              required
              type="checkbox"
            />
            <span>
              <strong>Confirm publication</strong>
              <span className="text-base-content/60 block text-sm">
                The saved source and approved translations become public. Later
                saves are visible immediately.
              </span>
            </span>
          </label>
          <button className="btn btn-primary mt-4" disabled={!readiness.ready}>
            Publish article
          </button>
        </form>
      ) : article.status === "published" ? (
        <form
          action={archiveArticleAction}
          className="rounded-box border-error/30 border p-4"
        >
          <input name="projectId" type="hidden" value={projectId} />
          <input name="articleId" type="hidden" value={article.articleId} />
          <label className="flex items-start gap-3">
            <input
              className="checkbox checkbox-error mt-1"
              required
              type="checkbox"
            />
            <span>
              <strong>Archive article</strong>
              <span className="text-base-content/60 block text-sm">
                This immediately hides the source and every translation. R1 has
                no restore action.
              </span>
            </span>
          </label>
          <button className="btn btn-error btn-outline mt-4">
            Archive article
          </button>
        </form>
      ) : (
        <div className="alert">
          <span>This article is archived and private.</span>
        </div>
      )}
    </div>
  );
}
