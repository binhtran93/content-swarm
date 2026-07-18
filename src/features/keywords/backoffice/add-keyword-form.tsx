"use client";

import { useActionState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { addKeywordAction } from "@/features/keywords/backoffice/keyword-actions.server";

export function AddKeywordForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(addKeywordAction, null);
  return (
    <form action={action} className="shrink-0">
      <ErrorToast message={state?.error} />
      <details
        className="collapse-arrow bg-base-100 border-base-300 collapse border"
        open={state?.error ? true : undefined}
      >
        <summary className="collapse-title flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <h2 className="font-medium">Add keywords</h2>
          </div>
        </summary>
        <div className="collapse-content border-base-300 border-t px-5 pb-5">
          <input name="projectId" type="hidden" value={projectId} />
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
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
          <div className="border-base-300 mt-4 flex justify-end border-t pt-4">
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
      </details>
    </form>
  );
}
