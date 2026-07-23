import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { StoryboardJobHistory } from "@/features/tools/backoffice/storyboard-job-history";
import { StoryboardUploader } from "@/features/tools/backoffice/storyboard-uploader";
import {
  getLocalMediaToolsCapability,
  listLocalStoryboardJobs,
} from "@/features/tools/service/local-tool-workspace.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export default async function StoryboardSplitterPage({
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

  const [capability, jobs] = await Promise.all([
    getLocalMediaToolsCapability(),
    listLocalStoryboardJobs(projectId),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageTitle title="Storyboard Splitter" />
      <StoryboardUploader
        available={capability.available}
        projectId={projectId}
        unavailableMessage={capability.message}
      />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Local history</h2>
        <StoryboardJobHistory jobs={jobs} projectId={projectId} />
      </section>
    </div>
  );
}
