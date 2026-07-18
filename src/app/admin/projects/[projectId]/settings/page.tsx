import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { ArchiveProjectControl } from "@/features/projects/backoffice/archive-project-control";
import { ProjectSettingsForm } from "@/features/projects/backoffice/project-settings-form";
import type { Project } from "@/features/projects/model/project";
import { getProject } from "@/features/projects/service/get-project.server";

export default async function ProjectSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ projectId }, query] = await Promise.all([params, searchParams]);
  let project: Project | null = null;
  try {
    project = await getProject(projectId);
  } catch {
    // A missing, invalid, or foreign project uses the same non-disclosing state.
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <PageTitle title="Project unavailable" />
        <div className="alert alert-warning" role="alert">
          <span>
            This project does not exist or is not available to your account.
          </span>
          <Link className="btn btn-sm" href="/admin/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const archived = project.status === "archived";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageTitle
        action={
          <Link className="btn btn-ghost btn-sm" href="/admin/projects">
            ← All projects
          </Link>
        }
        description={`Settings for ${project.projectId}`}
        title={project.name}
      />

      {query.created === "1" ? (
        <div className="alert alert-success" role="status">
          <span>Project created. It is ready for editorial work.</span>
        </div>
      ) : null}
      {query.saved === "1" ? (
        <div className="alert alert-success" role="status">
          <span>Project settings saved.</span>
        </div>
      ) : null}
      {archived ? (
        <div className="alert alert-warning" role="status">
          <span>
            This project is archived and read-only. Existing public pages remain
            online.
          </span>
        </div>
      ) : null}

      <section className="card bg-base-100 border-base-300 border shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Project settings</h2>
          {archived ? (
            <dl className="mt-3 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-base-content/55 text-sm">Project ID</dt>
                <dd className="mt-1 font-mono">{project.projectId}</dd>
              </div>
              <div>
                <dt className="text-base-content/55 text-sm">Canonical URL</dt>
                <dd className="mt-1 break-all">
                  {project.canonicalBaseUrl ?? "Not configured"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-base-content/55 text-sm">Description</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {project.description}
                </dd>
              </div>
            </dl>
          ) : (
            <ProjectSettingsForm project={project} />
          )}
        </div>
      </section>

      {!archived ? (
        <section className="card border-error/30 bg-base-100 border shadow-sm">
          <div className="card-body sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Archive project</h2>
              <p className="text-base-content/60 mt-1 text-sm">
                Stop future commands without removing existing published pages.
              </p>
            </div>
            <ArchiveProjectControl
              projectId={project.projectId}
              projectName={project.name}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
