import Link from "next/link";

import type { StoryboardJobSummary } from "@/features/tools/model/storyboard-splitter-job";
import { StoryboardJobDeleteButton } from "@/features/tools/backoffice/storyboard-job-delete-button";

export function StoryboardJobHistory({
  jobs,
  projectId,
}: {
  jobs: StoryboardJobSummary[];
  projectId: string;
}) {
  if (!jobs.length) {
    return (
      <div className="border-base-300 bg-base-100 rounded-2xl border px-6 py-10 text-center shadow-sm">
        <h2 className="font-semibold">No processed storyboards yet</h2>
        <p className="text-base-content/60 mt-2 text-sm">
          Your local processing history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="border-base-300 bg-base-100 overflow-x-auto rounded-2xl border">
      <table className="table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Status</th>
            <th>Panels</th>
            <th>Created</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td>
                <Link
                  className="link link-hover font-medium"
                  href={`/admin/projects/${projectId}/tools/storyboard-splitter/${job.jobId}`}
                >
                  {job.name}
                </Link>
                {job.error ? (
                  <p className="text-error mt-1 max-w-lg text-xs">
                    {job.error}
                  </p>
                ) : null}
              </td>
              <td>
                <span
                  className={`badge badge-sm ${
                    job.status === "ready"
                      ? "badge-success"
                      : job.status === "review"
                        ? "badge-info"
                        : job.status === "failed"
                          ? "badge-error"
                          : "badge-warning"
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td>{job.panelCount || "—"}</td>
              <td className="text-sm whitespace-nowrap">
                {new Date(job.createdAt).toLocaleString()}
              </td>
              <td className="text-right">
                <StoryboardJobDeleteButton
                  jobId={job.jobId}
                  jobName={job.name}
                  projectId={projectId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
