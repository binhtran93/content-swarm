"use client";

import { useActionState, useRef } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { archiveProjectAction } from "@/features/projects/backoffice/archive-project-action.server";

export function ArchiveProjectControl({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(
    archiveProjectAction.bind(null, projectId),
    null,
  );

  return (
    <>
      <ErrorToast message={state?.error} />
      <button
        className="btn btn-error btn-outline"
        onClick={() => dialog.current?.showModal()}
        type="button"
      >
        Archive project
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box">
          <h2 className="text-lg font-semibold">Archive {projectName}?</h2>
          <p className="text-base-content/70 mt-3">
            The project will no longer be available for new editorial, paid, or
            publishing commands. Existing public pages stay online.
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
              {pending ? "Archiving…" : "Archive project"}
            </button>
          </form>
        </div>
        <form className="modal-backdrop" method="dialog">
          <button aria-label="Close archive confirmation">close</button>
        </form>
      </dialog>
    </>
  );
}
