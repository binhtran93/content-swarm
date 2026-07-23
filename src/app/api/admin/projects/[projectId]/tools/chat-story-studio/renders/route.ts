import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createChatStoryRender } from "@/features/tools/service/chat-story-render.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";
export const maxDuration = 1800;

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;
    const body = (await request.json()) as { script?: unknown };
    const job = await createChatStoryRender(projectId, body.script);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return renderErrorResponse(error);
  }
}

function renderErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Check the chat script." },
      { status: 400 },
    );
  }
  if (error instanceof ToolServiceError) {
    const status =
      error.code === "not-found"
        ? 404
        : error.code === "processing"
          ? 409
          : error.code === "invalid"
            ? 400
            : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json(
    { error: "The chat video could not be prepared." },
    { status: 500 },
  );
}
