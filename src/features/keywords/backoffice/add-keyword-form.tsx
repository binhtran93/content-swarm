"use client";

import { useActionState } from "react";

import { addKeywordAction } from "@/features/keywords/backoffice/keyword-actions.server";

export function AddKeywordForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(addKeywordAction, null);
  return (
    <form action={action} className="card card-border bg-base-100">
      <div className="card-body">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="card-title">Add keywords</h2>
            <p className="text-base-content/60 mt-1 text-sm">
              Enter one keyword or paste one keyword per line. Blank and
              duplicate lines are skipped.
            </p>
          </div>
          <span className="badge badge-ghost badge-sm">Manual entry</span>
        </div>
        {state?.error ? (
          <div className="alert alert-error mt-4" role="alert">
            {state.error}
          </div>
        ) : null}
        <input name="projectId" type="hidden" value={projectId} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Keywords</legend>
            <textarea
              className="textarea min-h-28 w-full leading-6"
              name="keywords"
              placeholder={"cancel subscriptions\nsubscription tracker"}
              required
            />
            <p className="fieldset-label">Up to 250 lines per paste.</p>
          </fieldset>
          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Country</legend>
              <input
                className="input w-full uppercase"
                defaultValue="US"
                maxLength={2}
                name="countryCode"
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Language</legend>
              <input
                className="input w-full lowercase"
                defaultValue="en"
                maxLength={3}
                name="languageCode"
                required
              />
            </fieldset>
          </div>
        </div>
        <div className="border-base-300 mt-5 flex justify-end border-t pt-4">
          <button
            className="btn btn-primary btn-sm"
            disabled={pending}
            type="submit"
          >
            {pending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : null}
            {pending ? "Adding…" : "Add to backlog"}
          </button>
        </div>
      </div>
    </form>
  );
}
