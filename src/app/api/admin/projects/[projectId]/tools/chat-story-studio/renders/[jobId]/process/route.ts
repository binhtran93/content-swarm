import { NextResponse } from "next/server";

import { processChatStoryRender } from "@/features/tools/service/chat-story-render.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";
export const maxDuration = 1800;

export async function POST(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    return NextResponse.json(await processChatStoryRender(projectId, jobId));
  } catch (error) {
    if (error instanceof ToolServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "processing" ? 409 : 500 },
      );
    }
    return NextResponse.json(
      { error: "The chat video could not be rendered." },
      { status: 500 },
    );
  }
}
