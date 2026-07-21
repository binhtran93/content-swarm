import { NextResponse } from "next/server";

import { runDueArticleAutomations } from "@/features/articles/automation/run-article-automation.server";
import { verifyArticleAutomationScheduler } from "@/features/articles/automation/scheduler-auth.server";

export const maxDuration = 1800;

export async function POST(request: Request) {
  try {
    await verifyArticleAutomationScheduler(
      request.headers.get("authorization"),
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDueArticleAutomations();
  return NextResponse.json(result);
}
