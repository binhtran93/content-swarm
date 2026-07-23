"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function StoryboardJobNameForm({
  initialName,
  jobId,
  projectId,
}: {
  initialName: string;
  jobId: string;
  projectId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const response = await fetch(
      `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs/${jobId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      },
    );
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(body.error || "The name could not be saved.");
      setPending(false);
      return;
    }
    setMessage("Saved");
    setPending(false);
    router.refresh();
  }

  return (
    <form className="flex max-w-xl items-end gap-2" onSubmit={submit}>
      <label className="form-control grow">
        <span className="label-text mb-1 text-xs font-medium">Job name</span>
        <input
          className="input input-bordered input-sm w-full"
          maxLength={100}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </label>
      <button
        className="btn btn-sm"
        disabled={pending || name.trim() === initialName}
        type="submit"
      >
        {pending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : null}
        Save
      </button>
      {message ? (
        <span
          className={
            message === "Saved"
              ? "text-success pb-2 text-xs"
              : "text-error pb-2 text-xs"
          }
        >
          {message}
        </span>
      ) : null}
    </form>
  );
}
