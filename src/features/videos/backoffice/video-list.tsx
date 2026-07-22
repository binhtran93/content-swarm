import Link from "next/link";

import { localeLabel } from "@/config/supported-locales";
import type { QuickListVideo } from "@/features/videos/model/quick-list-video";

const statusStyle: Record<QuickListVideo["status"], string> = {
  draft: "badge-ghost",
  rendering: "badge-info",
  ready: "badge-success",
  failed: "badge-error",
};

export function VideoList({
  projectId,
  videos,
}: {
  projectId: string;
  videos: QuickListVideo[];
}) {
  if (!videos.length)
    return (
      <div className="border-base-300 bg-base-100 w-full rounded-2xl border px-6 py-12 text-center shadow-sm sm:px-12">
        <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-xl">
          <svg
            aria-hidden="true"
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="m15 10 4.2-2.4a1.2 1.2 0 0 1 1.8 1v6.8a1.2 1.2 0 0 1-1.8 1L15 14M5.5 6h7A2.5 2.5 0 0 1 15 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 3 15.5v-7A2.5 2.5 0 0 1 5.5 6Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-lg font-semibold">Create your first video</h2>
        <p className="text-base-content/60 mx-auto mt-2 max-w-md text-sm leading-6">
          Turn one idea and up to three images into a vertical three-point
          video.
        </p>
        <div className="mt-6">
          <Link
            className="btn btn-primary"
            href={`/admin/projects/${projectId}/videos/new`}
          >
            New video
          </Link>
        </div>
      </div>
    );

  return (
    <div className="rounded-box border-base-300 bg-base-100 overflow-x-auto border">
      <table className="table">
        <thead>
          <tr>
            <th>Video</th>
            <th>Language</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.videoId}>
              <td>
                <Link
                  className="link link-hover font-medium"
                  href={`/admin/projects/${projectId}/videos/${video.videoId}`}
                >
                  {video.approvedProposal?.title ?? video.prompt}
                </Link>
                <p className="text-base-content/55 mt-1 max-w-xl truncate text-xs">
                  {video.approvedProposal?.hook.onScreenText ??
                    "Storyboard not approved"}
                </p>
              </td>
              <td>{localeLabel(video.locale)}</td>
              <td>
                <span className={`badge badge-sm ${statusStyle[video.status]}`}>
                  {video.status}
                </span>
              </td>
              <td className="text-sm whitespace-nowrap">
                {new Date(video.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
