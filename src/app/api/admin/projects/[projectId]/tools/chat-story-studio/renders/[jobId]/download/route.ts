import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { getChatStoryVideo } from "@/features/tools/service/chat-story-render.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    const video = await getChatStoryVideo(projectId, jobId);
    return new NextResponse(new Uint8Array(await readFile(video.path)), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${safeHeaderFileName(video.fileName)}"`,
        "Content-Length": String(video.size),
        "Content-Type": "video/mp4",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof ToolServiceError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "The video is unavailable." },
      { status: 404 },
    );
  }
}

function safeHeaderFileName(value: string) {
  return value.replace(/["\\\r\n]/g, "-");
}
