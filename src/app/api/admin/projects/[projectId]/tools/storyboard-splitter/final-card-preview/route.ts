import { NextResponse } from "next/server";

import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { createProjectCtaCard } from "@/features/tools/service/process-storyboard.server";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;
    const project = await getProjectContext(projectId);
    const image = await createProjectCtaCard({
      width: 1080,
      height: 1920,
      branding: {
        projectId: project.projectId,
        name: project.name,
        description: project.description,
        showAppStore: Boolean(project.acquisition.appStoreUrl),
        showGooglePlay: Boolean(project.acquisition.googlePlayUrl),
      },
    });
    return new Response(new Uint8Array(image), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "image/png",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The final CTA preview could not be generated." },
      { status: 500 },
    );
  }
}
