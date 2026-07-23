import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { claimYoutubeAudioDownload } from "@/features/tools/service/youtube-audio.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ projectId: string; extractionId: string }>;
  },
) {
  try {
    const { projectId, extractionId } = await context.params;
    const download = await claimYoutubeAudioDownload(projectId, extractionId);
    const source = createReadStream(download.path);
    source.once("close", download.cleanup);
    source.once("error", download.cleanup);

    return new NextResponse(
      Readable.toWeb(source) as ReadableStream<Uint8Array>,
      {
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Disposition": `attachment; filename="${safeHeaderFileName(download.fileName)}"`,
          "Content-Length": String(download.size),
          "Content-Type": "audio/mpeg",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof ToolServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "not-found" ? 404 : 400 },
      );
    }
    return NextResponse.json(
      { error: "This audio download is unavailable." },
      { status: 404 },
    );
  }
}

function safeHeaderFileName(value: string) {
  return value.replace(/["\\\r\n]/g, "-");
}
