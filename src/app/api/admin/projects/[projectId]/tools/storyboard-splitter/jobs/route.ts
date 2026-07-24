import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createStoryboardJob } from "@/features/tools/service/storyboard-jobs.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";
export const maxDuration = 1800;

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;
    const formData = await request.formData();
    const upload = formData.get("storyboard");
    if (!(upload instanceof File)) {
      throw new ToolServiceError(
        "invalid",
        "Choose a PNG or JPEG storyboard image.",
      );
    }
    const job = await createStoryboardJob(projectId, upload);
    return NextResponse.json(
      { jobId: job.jobId, status: job.status },
      { status: 201 },
    );
  } catch (error) {
    return toolErrorResponse(error);
  }
}

function toolErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Check the upload." },
      { status: 400 },
    );
  }
  if (error instanceof ToolServiceError) {
    const status =
      error.code === "disabled"
        ? 503
        : error.code === "not-found"
          ? 404
          : error.code === "invalid"
            ? 400
            : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json(
    { error: "The storyboard could not be processed." },
    { status: 500 },
  );
}
