import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import {
  deleteStoryboardJob,
  renameStoryboardJob,
} from "@/features/tools/service/storyboard-jobs.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

const renameSchema = z.object({ name: z.string() });

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    const body = renameSchema.parse(await request.json());
    const job = await renameStoryboardJob(projectId, jobId, body.name);
    return NextResponse.json({ name: job.name, updatedAt: job.updatedAt });
  } catch (error) {
    return toolErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    await deleteStoryboardJob(projectId, jobId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toolErrorResponse(error);
  }
}

function toolErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Check the request." },
      { status: 400 },
    );
  }
  if (error instanceof ToolServiceError) {
    const status =
      error.code === "not-found" ? 404 : error.code === "invalid" ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json(
    { error: "The local storyboard job could not be updated." },
    { status: 500 },
  );
}
