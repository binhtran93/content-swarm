import Image from "next/image";
import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { StoryboardCropEditor } from "@/features/tools/backoffice/storyboard-crop-editor";
import { StoryboardJobDeleteButton } from "@/features/tools/backoffice/storyboard-job-delete-button";
import { StoryboardJobNameForm } from "@/features/tools/backoffice/storyboard-job-name-form";
import { getStoryboardJob } from "@/features/tools/service/storyboard-jobs.server";

export default async function StoryboardJobPage({
  params,
}: {
  params: Promise<{ projectId: string; jobId: string }>;
}) {
  const { projectId, jobId } = await params;
  let job;
  try {
    job = await getStoryboardJob(projectId, jobId);
  } catch {
    return (
      <div className="mx-auto max-w-3xl">
        <PageTitle title="Storyboard job unavailable" />
        <Link
          className="btn btn-sm"
          href={`/admin/projects/${projectId}/tools/storyboard-splitter`}
        >
          Back to Storyboard Splitter
        </Link>
      </div>
    );
  }

  const artifactBase = `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs/${jobId}/artifacts`;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          className="link link-hover text-base-content/60 text-sm"
          href={`/admin/projects/${projectId}/tools/storyboard-splitter`}
        >
          ← Storyboard Splitter
        </Link>
        <PageTitle
          action={
            <StoryboardJobDeleteButton
              jobId={jobId}
              jobName={job.name}
              projectId={projectId}
              redirectAfterDelete
            />
          }
          title={job.name}
        />
      </div>

      <div className="border-base-300 bg-base-100 rounded-2xl border p-5 shadow-sm">
        <StoryboardJobNameForm
          initialName={job.name}
          jobId={jobId}
          projectId={projectId}
        />
        <div className="text-base-content/60 mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span>Source: {job.source.originalName}</span>
          <span>
            {job.source.width}×{job.source.height}
          </span>
          <span>{job.panelCount} panels</span>
          <span
            className={`badge badge-sm ${
              job.status === "ready"
                ? "badge-success"
                : job.status === "failed"
                  ? "badge-error"
                  : "badge-warning"
            }`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {job.error ? (
        <div className="alert alert-error" role="alert">
          <span>{job.error}</span>
        </div>
      ) : null}

      {job.status !== "processing" && job.cropBounds.length ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Review crop rectangles</h2>
            <p className="text-base-content/60 mt-1 text-sm">
              Drag a rectangle to move it, or select it and drag a white handle
              to resize it. The red boundary is the exact final crop.
            </p>
          </div>
          <StoryboardCropEditor
            cropBounds={job.cropBounds}
            hasExistingResults={job.status === "ready"}
            jobId={jobId}
            projectId={projectId}
            sourceHeight={job.source.height}
            sourceUrl={`${artifactBase}/source`}
            sourceWidth={job.source.width}
          />
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Detection</h2>
          <div className="border-base-300 bg-base-100 overflow-hidden rounded-2xl border p-3">
            <Image
              alt={
                job.hasOverlay
                  ? "Storyboard with detected panel rectangles"
                  : "Uploaded storyboard"
              }
              className="h-auto w-full rounded-xl object-contain"
              height={job.source.height}
              src={`${artifactBase}/${job.hasOverlay ? "overlay" : "source"}`}
              unoptimized
              width={job.source.width}
            />
          </div>
        </section>
      )}

      {job.status === "ready" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Enhanced panels</h2>
            <a
              className="btn btn-primary btn-sm"
              href={`${artifactBase}/zip?download=1`}
            >
              Download all as ZIP
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {job.panels.map((panel, index) => (
              <article
                className="border-base-300 bg-base-100 overflow-hidden rounded-2xl border shadow-sm"
                key={panel.panelId}
              >
                <div className="bg-base-200 flex aspect-4/3 items-center justify-center p-2">
                  <Image
                    alt={`Enhanced storyboard panel ${index + 1}`}
                    className="max-h-full w-auto max-w-full object-contain"
                    height={panel.height}
                    src={`${artifactBase}/${panel.panelId}`}
                    unoptimized
                    width={panel.width}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-medium">{panel.fileName}</h3>
                    <p className="text-base-content/55 text-xs">
                      {panel.width}×{panel.height}
                    </p>
                  </div>
                  <a
                    className="btn btn-sm"
                    href={`${artifactBase}/${panel.panelId}?download=1`}
                  >
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
