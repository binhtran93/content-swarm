import { NextResponse } from "next/server";

import {
  cancelChatStoryRender,
  getChatStoryRender,
} from "@/features/tools/service/chat-story-render.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  return handle(context, getChatStoryRender);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  return handle(context, cancelChatStoryRender);
}

async function handle(
  context: { params: Promise<{ projectId: string; jobId: string }> },
  action: (projectId: string, jobId: string) => Promise<unknown>,
) {
  try {
    const { projectId, jobId } = await context.params;
    return NextResponse.json(await action(projectId, jobId));
  } catch (error) {
    if (error instanceof ToolServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "not-found" ? 404 : 400 },
      );
    }
    return NextResponse.json(
      { error: "The render is unavailable." },
      { status: 404 },
    );
  }
}
