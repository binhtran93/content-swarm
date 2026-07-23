import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { createYoutubeAudioExtraction } from "@/features/tools/service/youtube-audio.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

const requestSchema = z.object({ url: z.string() });

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;
    const { url } = requestSchema.parse(await request.json());
    const extraction = await createYoutubeAudioExtraction(projectId, url);
    return NextResponse.json(
      {
        extractionId: extraction.extractionId,
        fileName: extraction.fileName,
        downloadUrl: `/api/admin/projects/${projectId}/tools/youtube-audio/extractions/${extraction.extractionId}/download`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Check the YouTube URL." },
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
      { error: "The YouTube audio could not be extracted." },
      { status: 500 },
    );
  }
}
