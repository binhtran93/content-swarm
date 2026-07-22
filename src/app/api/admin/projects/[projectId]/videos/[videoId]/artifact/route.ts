import type { NextRequest } from "next/server";

import { readVideoArtifact } from "@/features/videos/rendering/local-video-workspace.server";
import { getVideo } from "@/features/videos/service/get-video.server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; videoId: string }> },
) {
  try {
    const { projectId, videoId } = await params;
    const video = await getVideo(projectId, videoId);
    const kind = request.nextUrl.searchParams.get("kind");
    const selected = selectArtifact(video, kind, request.nextUrl.searchParams);
    if (!selected) return new Response("Not Found", { status: 404 });

    const contents = await readVideoArtifact(selected.relativePath);
    const download = request.nextUrl.searchParams.get("download") === "1";
    const headers: Record<string, string> = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${selected.filename}"`,
      "Content-Type": selected.contentType,
      "X-Content-Type-Options": "nosniff",
    };
    const range =
      selected.contentType === "video/mp4"
        ? parseByteRange(request.headers.get("range"), contents.byteLength)
        : null;
    if (range) {
      const body = contents.subarray(range.start, range.end + 1);
      headers["Content-Length"] = String(body.byteLength);
      headers["Content-Range"] =
        `bytes ${range.start}-${range.end}/${contents.byteLength}`;
      return new Response(new Uint8Array(body), { headers, status: 206 });
    }
    headers["Content-Length"] = String(contents.byteLength);
    return new Response(new Uint8Array(contents), { headers });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

function selectArtifact(
  video: Awaited<ReturnType<typeof getVideo>>,
  kind: string | null,
  searchParams: URLSearchParams,
) {
  if (kind === "video" && video.status === "ready" && video.outputPath)
    return {
      relativePath: video.outputPath,
      contentType: "video/mp4",
      filename: `${video.videoId}.mp4`,
    };
  if (kind === "cover" && video.status === "ready" && video.coverPath)
    return {
      relativePath: video.coverPath,
      contentType: "image/png",
      filename: `${video.videoId}-cover.png`,
    };
  if (kind === "input") {
    const rawIndex = searchParams.get("index");
    const index = rawIndex === null ? Number.NaN : Number(rawIndex);
    const asset = Number.isInteger(index) ? video.assets[index] : undefined;
    if (asset)
      return {
        relativePath: asset.relativePath,
        contentType: asset.contentType,
        filename: `${asset.assetId}${asset.contentType === "image/png" ? ".png" : ".jpg"}`,
      };
  }
  return null;
}

function parseByteRange(value: string | null, size: number) {
  const match = value?.match(/^bytes=(\d+)-(\d*)$/);
  if (!match) return null;
  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || start < 0 || start >= size) return null;
  const end = Math.min(requestedEnd, size - 1);
  if (!Number.isSafeInteger(end) || end < start) return null;
  return { start, end };
}
