"use client";

import { useState, type FormEvent } from "react";

import type { YoutubeAudioExtractionResponse } from "@/features/tools/model/youtube-audio";

export function YoutubeAudioExtractor({
  available,
  unavailableMessage,
  projectId,
}: {
  available: boolean;
  unavailableMessage: string | null;
  projectId: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = event.currentTarget;
    const input = new FormData(form).get("url");

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/tools/youtube-audio/extractions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input }),
        },
      );
      const body =
        (await response.json()) as Partial<YoutubeAudioExtractionResponse> & {
          error?: string;
        };
      if (!response.ok || !body.downloadUrl) {
        throw new Error(body.error || "The audio could not be extracted.");
      }

      const anchor = document.createElement("a");
      anchor.href = body.downloadUrl;
      anchor.download = body.fileName ?? "youtube-audio.mp3";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      form.reset();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The audio could not be extracted.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border-base-300 bg-base-100 rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Extract audio</h2>
      <p className="text-base-content/65 mt-1 text-sm leading-6">
        Paste one public YouTube video URL to download its audio as an MP3.
      </p>
      {!available ? (
        <div className="alert alert-warning mt-5" role="status">
          <span>
            {unavailableMessage ?? "YouTube audio tools unavailable."}
          </span>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-error mt-5" role="alert">
          <span>{error}</span>
        </div>
      ) : null}
      <form className="mt-5 flex flex-col gap-4 sm:flex-row" onSubmit={submit}>
        <input
          aria-label="YouTube video URL"
          autoComplete="url"
          className="input input-bordered w-full"
          disabled={!available || pending}
          name="url"
          placeholder="https://www.youtube.com/watch?v=…"
          required
          type="url"
        />
        <button
          className="btn btn-primary shrink-0"
          disabled={!available || pending}
          type="submit"
        >
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {pending ? "Extracting…" : "Download MP3"}
        </button>
      </form>
      <p className="text-base-content/50 mt-3 text-xs leading-5">
        Only download content you own or are authorized to use. Host request
        limits and available disk space still apply.
      </p>
    </div>
  );
}
