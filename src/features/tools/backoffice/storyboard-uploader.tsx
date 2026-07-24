"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

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
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyboard, setStoryboard] = useState<File | null>(null);

  useEffect(() => {
    function acceptClipboardImage(event: ClipboardEvent) {
      const item = Array.from(event.clipboardData?.items ?? []).find(
        ({ kind, type }) => kind === "file" && /^image\/(png|jpeg)$/.test(type),
      );
      const pastedFile = item?.getAsFile();
      if (!pastedFile) return;

      event.preventDefault();
      const extension = pastedFile.type === "image/jpeg" ? "jpg" : "png";
      const pastedStoryboard = new File(
        [pastedFile],
        `pasted-storyboard-${Date.now()}.${extension}`,
        {
          type: pastedFile.type,
          lastModified: Date.now(),
        },
      );
      if (fileInput.current) {
        if (typeof DataTransfer === "undefined") {
          Object.defineProperty(fileInput.current, "files", {
            configurable: true,
            value: [pastedStoryboard],
          });
        } else {
          const transfer = new DataTransfer();
          transfer.items.add(pastedStoryboard);
          fileInput.current.files = transfer.files;
        }
      }
      setStoryboard(pastedStoryboard);
      setError(null);
    }

    window.addEventListener("paste", acceptClipboardImage);
    return () => window.removeEventListener("paste", acceptClipboardImage);
  }, []);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  async function previewFinalCta() {
    setError(null);
    setPreviewing(true);
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/tools/storyboard-splitter/final-card-preview`,
        {
          method: "POST",
        },
      );
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error || "The final CTA could not be previewed.");
      }
      const nextPreviewUrl = URL.createObjectURL(await response.blob());
      setPreviewUrl(nextPreviewUrl);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The final CTA could not be previewed.",
      );
    } finally {
      setPreviewing(false);
    }
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    setStoryboard(event.target.files?.[0] ?? null);
    setError(null);
  }

  function clearFile() {
    if (fileInput.current) {
      fileInput.current.value = "";
      if (typeof DataTransfer === "undefined") {
        Object.defineProperty(fileInput.current, "files", {
          configurable: true,
          value: [],
        });
      }
    }
    setStoryboard(null);
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!storyboard) {
      setError("Choose or paste a PNG or JPEG storyboard first.");
      return;
    }
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("storyboard", storyboard);
      const response = await fetch(
        `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs`,
        {
          method: "POST",
          body: formData,
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
        Choose or paste one PNG or JPEG contact sheet with clear dark
        rectangular panel borders. You can review every crop before 4×
        enhancement.
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
      <button
        className="btn btn-outline btn-sm mt-5"
        disabled={!available || previewing}
        onClick={previewFinalCta}
        type="button"
      >
        {previewing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : null}
        {previewing ? "Rendering preview…" : "Preview final CTA"}
      </button>
      {previewUrl ? (
        <div
          aria-label="Final CTA preview dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5"
          role="dialog"
        >
          <div className="bg-base-100 flex max-h-full max-w-lg flex-col rounded-2xl p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="font-semibold">Final CTA preview</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPreviewUrl(null)}
                type="button"
              >
                Close
              </button>
            </div>
            <Image
              alt="Final CTA preview"
              className="min-h-0 w-auto rounded-lg object-contain"
              height={1920}
              src={previewUrl}
              unoptimized
              width={1080}
            />
          </div>
        </div>
      ) : null}
      <form className="mt-5 flex flex-col gap-4 sm:flex-row" onSubmit={submit}>
        <input
          accept="image/png,image/jpeg"
          aria-label="Storyboard image"
          className="file-input file-input-bordered w-full"
          disabled={!available || pending}
          name="storyboard"
          onChange={selectFile}
          ref={fileInput}
          type="file"
        />
        {storyboard ? (
          <button
            aria-label="Remove selected image"
            className="btn btn-outline shrink-0"
            disabled={pending}
            onClick={clearFile}
            type="button"
          >
            Remove
          </button>
        ) : null}
        <button
          className="btn btn-primary shrink-0"
          disabled={!available || pending || !storyboard}
          type="submit"
        >
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {pending ? "Detecting panels…" : "Detect panels"}
        </button>
      </form>
      <p className="text-base-content/50 mt-3 text-xs">
        Maximum file size: 25 MB. Processing stays on this machine.
      </p>
    </div>
  );
}
