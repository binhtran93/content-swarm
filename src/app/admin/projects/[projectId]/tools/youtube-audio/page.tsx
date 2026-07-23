import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { YoutubeAudioExtractor } from "@/features/tools/backoffice/youtube-audio-extractor";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getYoutubeAudioCapability } from "@/features/tools/service/youtube-audio-binaries.server";

export default async function YoutubeAudioPage({
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

  const capability = await getYoutubeAudioCapability();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageTitle title="YouTube Audio Extractor" />
      <YoutubeAudioExtractor
        available={capability.available}
        projectId={projectId}
        unavailableMessage={capability.message}
      />
    </div>
  );
}
