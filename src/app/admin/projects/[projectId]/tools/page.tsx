import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  try {
    await getProjectContext(projectId);
  } catch {
    return (
      <div className="mx-auto max-w-3xl">
        <PageTitle title="Project unavailable" />
        <Link className="btn btn-sm" href="/admin/projects">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageTitle title="Tools" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Link
          className="card border-base-300 bg-base-100 group border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          href={`/admin/projects/${projectId}/tools/storyboard-splitter`}
        >
          <div className="card-body">
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
              <svg
                aria-hidden="true"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" />
              </svg>
            </div>
            <h2 className="card-title mt-3">Storyboard Splitter</h2>
            <p className="text-base-content/65 text-sm leading-6">
              Cut a bordered storyboard into individual panels and enhance every
              image at 4× resolution.
            </p>
            <div className="card-actions mt-3 justify-end">
              <span className="btn btn-primary btn-sm">Open tool</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
