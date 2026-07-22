import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { VideoList } from "@/features/videos/backoffice/video-list";
import { listVideos } from "@/features/videos/service/list-videos.server";

export default async function VideosPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let videos: Awaited<ReturnType<typeof listVideos>> | null = null;
  try {
    videos = await listVideos(projectId);
  } catch {}

  if (!videos)
    return (
      <div className="mx-auto max-w-3xl">
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
            className="btn btn-primary btn-sm"
            href={`/admin/projects/${projectId}/videos/new`}
          >
            New video
          </Link>
        }
        title="Videos"
      />
      <VideoList projectId={projectId} videos={videos} />
    </div>
  );
}
