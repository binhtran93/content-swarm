import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { VideoCreator } from "@/features/videos/backoffice/video-creator";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export const maxDuration = 1800;

export default async function NewVideoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project: Awaited<ReturnType<typeof getProjectContext>> | null = null;
  try {
    project = await getProjectContext(projectId);
  } catch {}

  if (!project)
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PageTitle title="Project unavailable" />
        <Link className="btn btn-sm" href="/admin/projects">
          Back to projects
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageTitle
        action={
          <Link
            className="btn btn-ghost btn-sm"
            href={`/admin/projects/${projectId}/videos`}
          >
            All videos
          </Link>
        }
        title="New video"
      />
      <VideoCreator projectId={projectId} projectName={project.name} />
    </div>
  );
}
