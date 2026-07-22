import Link from "next/link";
import type { ReactNode } from "react";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import {
  openVideoInFinderAction,
  retryVideoAction,
} from "@/features/videos/backoffice/video-actions.server";
import { getVideo } from "@/features/videos/service/get-video.server";

export const maxDuration = 1800;

export default async function VideoPage({
  params,
}: {
  params: Promise<{ projectId: string; videoId: string }>;
}) {
  const { projectId, videoId } = await params;
  let video: Awaited<ReturnType<typeof getVideo>> | null = null;
  try {
    video = await getVideo(projectId, videoId);
  } catch {}

  if (!video)
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PageTitle title="Video unavailable" />
        <Link
          className="btn btn-sm"
          href={`/admin/projects/${projectId}/videos`}
        >
          Back to videos
        </Link>
      </div>
    );

  const proposal = video.approvedProposal;
  const artifactUrl = `/api/admin/projects/${projectId}/videos/${videoId}/artifact`;
  const retry = retryVideoAction.bind(null, projectId, videoId);
  const openInFinder = openVideoInFinderAction.bind(null, projectId, videoId);

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
        title={proposal?.title ?? "Video draft"}
      />

      {video.status === "ready" && video.outputPath && proposal ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)]">
          <section className="space-y-4">
            <video
              className="bg-base-300 aspect-[9/16] w-full rounded-2xl object-cover shadow-xl"
              controls
              playsInline
              poster={`${artifactUrl}?kind=cover`}
              preload="metadata"
              src={`${artifactUrl}?kind=video`}
            />
            <div className="flex flex-wrap gap-2">
              <a
                className="btn btn-primary flex-1"
                download
                href={`${artifactUrl}?kind=video&download=1`}
              >
                Download MP4
              </a>
              <form action={openInFinder}>
                <button className="btn btn-outline" type="submit">
                  Show in Finder
                </button>
              </form>
            </div>
          </section>

          <div className="space-y-5">
            <ResultCard title="TikTok caption">
              <p className="whitespace-pre-wrap">{proposal.caption}</p>
              <p className="text-primary mt-4 font-medium">
                {proposal.hashtags.join(" ")}
              </p>
            </ResultCard>
            <ResultCard title="Cover and sound">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-base-content/55 text-xs uppercase">
                    Cover text
                  </dt>
                  <dd className="mt-1 font-medium">{proposal.coverText}</dd>
                </div>
                <div>
                  <dt className="text-base-content/55 text-xs uppercase">
                    Suggested music mood
                  </dt>
                  <dd className="mt-1 font-medium">{proposal.musicMood}</dd>
                </div>
              </dl>
            </ResultCard>
            <ResultCard title="Storyboard">
              <p className="font-semibold">{proposal.hook.onScreenText}</p>
              <ol className="mt-4 space-y-3">
                {proposal.points.map((point, index) => (
                  <li className="flex gap-3" key={index}>
                    <span className="badge badge-primary">{index + 1}</span>
                    <div>
                      <p className="font-semibold">{point.heading}</p>
                      <p className="text-base-content/70 mt-1 text-sm">
                        {point.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </ResultCard>
            {proposal.references.length ? (
              <ResultCard title="Sources">
                <ul className="space-y-2 text-sm">
                  {proposal.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        className="link link-primary"
                        href={reference.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {reference.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            ) : null}
          </div>
        </div>
      ) : (
        <section className="card border-base-300 bg-base-100 border shadow-sm">
          <div className="card-body">
            <div
              className={`alert ${video.status === "failed" ? "alert-error" : "alert-info"}`}
            >
              <span>
                {video.status === "failed"
                  ? video.lastError || "Rendering failed."
                  : video.status === "rendering"
                    ? "This video is rendering on the local Mac."
                    : "This draft has no approved storyboard. Create a new video to generate another proposal."}
              </span>
            </div>
            {video.status === "failed" && proposal ? (
              <form action={retry} className="card-actions justify-end">
                <button className="btn btn-primary" type="submit">
                  Retry render
                </button>
              </form>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

function ResultCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="card border-base-300 bg-base-100 border shadow-sm">
      <div className="card-body p-5 sm:p-6">
        <h2 className="card-title text-base">{title}</h2>
        <div className="text-sm leading-6">{children}</div>
      </div>
    </section>
  );
}
