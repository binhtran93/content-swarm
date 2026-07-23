import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import type { Project } from "@/features/projects/model/project";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { PromptStudio } from "@/features/tools/backoffice/prompt-studio";

export default async function PromptStudioPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project: Project | null = null;
  try {
    project = await getProjectContext(projectId);
  } catch {
    // Missing, archived, invalid, and foreign Projects share one state.
  }

  if (!project) {
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          className="link link-hover text-base-content/60 text-sm"
          href={`/admin/projects/${projectId}/tools`}
        >
          ← Tools
        </Link>
        <PageTitle title="Prompt Studio" />
      </div>
      <PromptStudio project={project} />
    </div>
  );
}
