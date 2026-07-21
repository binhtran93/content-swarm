"use server";

import { redirect } from "next/navigation";

import { runArticleAutomationNow } from "@/features/articles/automation/run-article-automation.server";

export async function triggerArticleAutomationAction(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  let result: "published" | "empty" | "busy" | "failed";
  try {
    result = await runArticleAutomationNow(projectId);
  } catch {
    result = "failed";
  }
  redirect(`/admin/projects/${projectId}/articles?automation=${result}`);
}
