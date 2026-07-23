import { NextResponse } from "next/server";

import { getStoryboardArtifact } from "@/features/tools/service/get-storyboard-artifact.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      projectId: string;
      jobId: string;
      artifactId: string;
    }>;
  },
) {
  try {
    const { projectId, jobId, artifactId } = await context.params;
    const artifact = await getStoryboardArtifact(projectId, jobId, artifactId);
    const download =
      new URL(request.url).searchParams.get("download") === "1" ||
      artifact.contentType === "application/zip";
    return new NextResponse(new Uint8Array(artifact.contents), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeHeaderFileName(artifact.fileName)}"`,
        "Content-Type": artifact.contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof ToolServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "not-found" ? 404 : 400 },
      );
    }
    return NextResponse.json(
      { error: "Artifact is unavailable." },
      { status: 404 },
    );
  }
}

function safeHeaderFileName(value: string) {
  return value.replace(/["\\\r\n]/g, "-");
}
