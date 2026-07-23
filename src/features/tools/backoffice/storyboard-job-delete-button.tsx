"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StoryboardJobDeleteButton({
  jobId,
  jobName,
  projectId,
  redirectAfterDelete = false,
}: {
  jobId: string;
  jobName: string;
  projectId: string;
  redirectAfterDelete?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (
      !window.confirm(
        `Delete “${jobName}” and all of its local images? This cannot be undone.`,
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    const response = await fetch(
      `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs/${jobId}`,
      { method: "DELETE" },
    );
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error || "The job could not be deleted.");
      setPending(false);
      return;
    }
    if (redirectAfterDelete) {
      router.push(`/admin/projects/${projectId}/tools/storyboard-splitter`);
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="btn btn-error btn-ghost btn-sm"
        disabled={pending}
        onClick={remove}
        type="button"
      >
        {pending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : null}
        Delete
      </button>
      {error ? (
        <span className="text-error max-w-64 text-right text-xs">{error}</span>
      ) : null}
    </div>
  );
}
