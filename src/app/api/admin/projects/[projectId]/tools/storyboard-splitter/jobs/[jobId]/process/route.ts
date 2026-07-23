import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { storyboardCropBoundsSchema } from "@/features/tools/model/storyboard-splitter-job";
import { processStoryboardJob } from "@/features/tools/service/storyboard-jobs.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";
export const maxDuration = 1800;

const processSchema = z.object({
  rectangles: storyboardCropBoundsSchema,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    const { rectangles } = processSchema.parse(await request.json());
    const job = await processStoryboardJob(projectId, jobId, rectangles);
    return NextResponse.json({
      status: job.status,
      error: job.error,
      updatedAt: job.updatedAt,
    });
  } catch (error) {
    return processErrorResponse(error);
  }
}

function processErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Check the crop rectangles." },
      { status: 400 },
    );
  }
  if (error instanceof ToolServiceError) {
    return NextResponse.json(
      { error: error.message },
      {
        status:
          error.code === "not-found"
            ? 404
            : error.code === "invalid"
              ? 400
              : 500,
      },
    );
  }
  return NextResponse.json(
    { error: "The storyboard could not be processed." },
    { status: 500 },
  );
}
