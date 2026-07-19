import Link from "next/link";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { PageTitle } from "@/backoffice/components/ui/page-title";
import type { Project } from "@/features/projects/model/project";
import { listActiveProjects } from "@/features/projects/service/list-active-projects.server";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card bg-base-100 border-base-300 border shadow-sm transition-shadow hover:shadow-md">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="card-title">{project.name}</h2>
            <p className="text-base-content/50 mt-1 font-mono text-xs">
              {project.projectId}
            </p>
          </div>
          <span className="badge badge-success badge-soft">Active</span>
        </div>
        <p className="text-base-content/70 line-clamp-3 text-sm">
          {project.description}
        </p>
        <div className="text-base-content/60 flex min-h-6 items-center gap-2 text-sm">
          <span aria-hidden="true">↗</span>
          {project.canonicalBaseUrl ? (
            <span className="truncate">{project.canonicalBaseUrl}</span>
          ) : (
            <span className="text-warning">Publication URL not configured</span>
          )}
        </div>
        <div className="card-actions border-base-300 items-center justify-between border-t pt-4">
          <span className="text-base-content/50 text-xs">
            Updated{" "}
            {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
              new Date(project.updatedAt),
            )}
          </span>
          <Link
            aria-label={`Open ${project.name} settings`}
            className="btn btn-sm btn-outline"
            href={`/admin/projects/${project.projectId}/settings`}
          >
            Open project
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  let projects: Project[] | null = null;
  try {
    projects = await listActiveProjects();
  } catch {
    // The protected layout already handles authentication. This is an explicit
    // recoverable read state for Firestore or malformed-data failures.
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageTitle
        action={
          <Link className="btn btn-primary btn-sm" href="/admin/projects/new">
            <span aria-hidden="true">＋</span>
            New project
          </Link>
        }
        title="Projects"
      />

      {projects === null ? (
        <ErrorToast message="Projects could not be loaded." />
      ) : projects.length === 0 ? (
        <section className="card bg-base-100 border-base-300 border shadow-sm">
          <div className="card-body items-center py-14 text-center">
            <div className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl text-2xl">
              ◫
            </div>
            <h2 className="mt-2 text-xl font-semibold">
              Create your first project
            </h2>
            <p className="text-base-content/60 max-w-md">
              Each product gets isolated editorial data and its own publication
              URL.
            </p>
            <Link className="btn btn-primary mt-3" href="/admin/projects/new">
              New project
            </Link>
          </div>
        </section>
      ) : (
        <section
          aria-label="Active projects"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </section>
      )}
    </div>
  );
}
