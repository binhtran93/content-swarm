import { PendingSubmitButton } from "@/backoffice/components/ui/pending-submit-button";
import { localeLabel } from "@/config/supported-locales";
import {
  archiveArticleAction,
  publishArticleAction,
} from "@/features/articles/backoffice/article-actions.server";
import type { Article } from "@/features/articles/model/article";
import type { Translation } from "@/features/articles/model/translation";
import type { ArticleReadiness } from "@/features/articles/service/evaluate-article-readiness";

export function ArticlePublishPreview({
  article,
  projectId,
  readiness,
  translations,
}: {
  article: Article;
  projectId: string;
  readiness: ArticleReadiness;
  translations: Translation[];
}) {
  const approvedTranslations = translations.filter(
    (translation) => translation.status === "approved",
  );
  const draftCount = translations.length - approvedTranslations.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h2 className="text-base font-medium">Publish</h2>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {!readiness.ready ? (
          <section className="rounded-box border-warning/40 bg-warning/10 border p-4">
            <h3 className="font-medium">Resolve before publishing</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {readiness.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-box border-base-300 border p-4">
          <h3 className="font-medium">Publication</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="badge badge-neutral badge-outline">
              {localeLabel(article.locale)}
            </span>
            {approvedTranslations.map((translation) => (
              <span
                className="badge badge-success badge-outline"
                key={translation.locale}
              >
                {localeLabel(translation.locale)}
              </span>
            ))}
          </div>
          {draftCount ? (
            <p className="text-base-content/60 mt-3 text-sm">
              {draftCount} draft translation{draftCount === 1 ? "" : "s"} will
              not be published.
            </p>
          ) : null}
        </section>

        {article.status === "draft" ? (
          <form
            action={publishArticleAction}
            className="rounded-box border-base-300 flex flex-wrap items-center justify-between gap-4 border p-4"
          >
            <input name="projectId" type="hidden" value={projectId} />
            <input name="articleId" type="hidden" value={article.articleId} />
            <label className="flex min-w-0 items-start gap-3">
              <input
                className="checkbox checkbox-primary mt-0.5"
                disabled={!readiness.ready}
                required
                type="checkbox"
              />
              <span>
                <strong>Confirm publication</strong>
                <span className="text-base-content/60 block text-sm">
                  Make the source and approved translations public.
                </span>
              </span>
            </label>
            <PendingSubmitButton
              className="btn btn-primary btn-sm"
              disabled={!readiness.ready}
              label="Publish article"
              pendingLabel="Publishing…"
            />
          </form>
        ) : article.status === "published" ? (
          <form
            action={archiveArticleAction}
            className="rounded-box border-error/30 flex flex-wrap items-center justify-between gap-4 border p-4"
          >
            <input name="projectId" type="hidden" value={projectId} />
            <input name="articleId" type="hidden" value={article.articleId} />
            <label className="flex min-w-0 items-start gap-3">
              <input
                className="checkbox checkbox-error mt-0.5"
                required
                type="checkbox"
              />
              <span>
                <strong>Confirm archive</strong>
                <span className="text-base-content/60 block text-sm">
                  Hide the source and every translation immediately.
                </span>
              </span>
            </label>
            <PendingSubmitButton
              className="btn btn-error btn-outline btn-sm"
              label="Archive article"
              pendingLabel="Archiving…"
            />
          </form>
        ) : (
          <div className="alert">
            <span>This article is archived and private.</span>
          </div>
        )}
      </div>
    </div>
  );
}
