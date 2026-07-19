"use client";

import { useEffect, useRef, useState } from "react";

import type { ArticleContentChange } from "@/features/articles/model/article-content-change";

export function ContentImprovementDialog({
  applying,
  changes,
  onApply,
  onDismiss,
}: {
  applying: boolean;
  changes: ArticleContentChange[];
  onApply: (changes: ArticleContentChange[]) => void;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      const dialog = dialogRef.current;

      if (!cancelled && dialog && !dialog.open) dialog.showModal();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(index: number) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(index)) next.delete(index);
      else next.add(index);

      return next;
    });
  }

  function close() {
    if (!applying) dialogRef.current?.close();
  }

  const selectedChanges = changes.filter((_, index) => selected.has(index));

  return (
    <dialog
      className="modal"
      onCancel={(event) => {
        if (applying) event.preventDefault();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
      onClose={onDismiss}
      ref={dialogRef}
    >
      <div className="modal-box flex h-[min(52rem,calc(100dvh-3rem))] max-w-5xl flex-col gap-0 p-0">
        <header className="border-base-300 flex shrink-0 items-center justify-between gap-4 border-b px-5 py-4">
          <div>
            <h3 className="font-semibold">Review improvements</h3>
            <p className="text-base-content/60 mt-0.5 text-sm">
              {changes.length} proposed{" "}
              {changes.length === 1 ? "change" : "changes"}
            </p>
          </div>
          {changes.length ? (
            <div className="flex gap-1">
              <button
                className="btn btn-ghost btn-sm"
                disabled={applying || selected.size === changes.length}
                onClick={() =>
                  setSelected(new Set(changes.map((_, index) => index)))
                }
                type="button"
              >
                Select all
              </button>
              <button
                className="btn btn-ghost btn-sm"
                disabled={applying || selected.size === 0}
                onClick={() => setSelected(new Set())}
                type="button"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {changes.length ? (
            <div className="space-y-4">
              {changes.map((change, index) => (
                <label
                  className={`border-base-300 rounded-box block cursor-pointer border p-4 transition-colors ${
                    selected.has(index) ? "border-primary bg-primary/5" : ""
                  }`}
                  key={`${index}-${change.before.slice(0, 40)}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <input
                      checked={selected.has(index)}
                      className="checkbox checkbox-primary checkbox-sm"
                      disabled={applying}
                      onChange={() => toggle(index)}
                      type="checkbox"
                    />
                    <span className="text-sm font-medium">
                      Change {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    <section>
                      <h4 className="text-base-content/60 mb-1.5 text-xs font-semibold tracking-wide uppercase">
                        Before
                      </h4>
                      <div className="bg-error/5 border-error/20 rounded-field h-full border p-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {change.before}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-base-content/60 mb-1.5 text-xs font-semibold tracking-wide uppercase">
                        After
                      </h4>
                      <div className="bg-success/5 border-success/20 rounded-field h-full border p-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {change.after}
                      </div>
                    </section>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-center">
              <div>
                <p className="font-medium">No meaningful changes found</p>
                <p className="text-base-content/60 mt-1 text-sm">
                  The current content is ready for your review.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="border-base-300 flex shrink-0 justify-end gap-2 border-t px-5 py-4">
          <button
            className="btn btn-ghost btn-sm"
            disabled={applying}
            onClick={close}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            disabled={applying || selectedChanges.length === 0}
            onClick={() => onApply(selectedChanges)}
            type="button"
          >
            {applying ? "Applying…" : "Apply selected changes"}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
