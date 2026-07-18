"use client";

import { useActionState, useRef } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { deleteArticleAction } from "@/features/articles/backoffice/delete-article-action.server";

export function DeleteArticleControl({
  articleId,
  articleTitle,
  projectId,
}: {
  articleId: string;
  articleTitle: string;
  projectId: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(
    deleteArticleAction.bind(null, projectId, articleId),
    null,
  );

  return (
    <>
      <ErrorToast message={state?.error} />
      <button
        className="btn btn-error btn-ghost btn-sm"
        onClick={() => dialog.current?.showModal()}
        type="button"
      >
        Delete
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box">
          <h2 className="text-lg font-semibold">Delete {articleTitle}?</h2>
          <p className="text-base-content/70 mt-3">
            This permanently deletes the article. Its assigned keyword or
            keyword group will be released and return to the Backlog.
          </p>
          <form action={action} className="modal-action">
            <button
              className="btn btn-ghost"
              disabled={pending}
              onClick={() => dialog.current?.close()}
              type="button"
            >
              Cancel
            </button>
            <button className="btn btn-error" disabled={pending} type="submit">
              {pending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              {pending ? "Deleting…" : "Delete article"}
            </button>
          </form>
        </div>
        <form className="modal-backdrop" method="dialog">
          <button aria-label="Close delete confirmation">close</button>
        </form>
      </dialog>
    </>
  );
}
