"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function StoryboardUploader({
  available,
  unavailableMessage,
  projectId,
}: {
  available: boolean;
  unavailableMessage: string | null;
  projectId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs`,
        {
          method: "POST",
          body: new FormData(event.currentTarget),
        },
      );
      const body = (await response.json()) as {
        jobId?: string;
        error?: string;
      };
      if (!response.ok || !body.jobId) {
        throw new Error(body.error || "The storyboard could not be processed.");
      }
      router.push(
        `/admin/projects/${projectId}/tools/storyboard-splitter/${body.jobId}`,
      );
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The storyboard could not be processed.",
      );
      setPending(false);
    }
  }

  return (
    <div className="border-base-300 bg-base-100 rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Process a storyboard</h2>
      <p className="text-base-content/65 mt-1 text-sm leading-6">
        Upload one PNG or JPEG contact sheet with clear dark rectangular panel
        borders. Each detected panel will be enhanced at 4× resolution.
      </p>
      {!available ? (
        <div className="alert alert-warning mt-5" role="status">
          <span>{unavailableMessage ?? "Local media tools unavailable."}</span>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-error mt-5" role="alert">
          <span>{error}</span>
        </div>
      ) : null}
      <form className="mt-5 flex flex-col gap-4 sm:flex-row" onSubmit={submit}>
        <input
          accept="image/png,image/jpeg"
          className="file-input file-input-bordered w-full"
          disabled={!available || pending}
          name="storyboard"
          required
          type="file"
        />
        <button
          className="btn btn-primary shrink-0"
          disabled={!available || pending}
          type="submit"
        >
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {pending ? "Cutting and enhancing…" : "Process image"}
        </button>
      </form>
      <p className="text-base-content/50 mt-3 text-xs">
        Maximum file size: 25 MB. Processing stays on this machine.
      </p>
    </div>
  );
}
