import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { storyboardCropBoundsSchema } from "@/features/tools/model/storyboard-splitter-job";
import { saveStoryboardCrops } from "@/features/tools/service/storyboard-jobs.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

const cropUpdateSchema = z.object({
  rectangles: storyboardCropBoundsSchema,
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string; jobId: string }> },
) {
  try {
    const { projectId, jobId } = await context.params;
    const { rectangles } = cropUpdateSchema.parse(await request.json());
    const job = await saveStoryboardCrops(projectId, jobId, rectangles);
    return NextResponse.json({
      rectangles: job.cropBounds,
      status: job.status,
      updatedAt: job.updatedAt,
    });
  } catch (error) {
    return cropErrorResponse(error);
  }
}

function cropErrorResponse(error: unknown) {
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
    { error: "The crop rectangles could not be saved." },
    { status: 500 },
  );
}
