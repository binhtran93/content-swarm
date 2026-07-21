"use server";

import { revalidatePath } from "next/cache";

import { updateArticleAutomationSettings } from "@/features/articles/automation/article-automation-settings.server";

export type ArticleAutomationActionState = {
  error?: string;
  saved?: boolean;
} | null;

export async function updateArticleAutomationAction(
  projectId: string,
  _state: ArticleAutomationActionState,
  formData: FormData,
): Promise<ArticleAutomationActionState> {
  try {
    await updateArticleAutomationSettings(projectId, {
      enabled: formData.get("enabled") === "on",
      localTime: String(formData.get("localTime") ?? "09:00"),
      timeZone: String(formData.get("timeZone") ?? "UTC"),
    });
    revalidatePath(`/admin/projects/${projectId}/settings`);
    return { saved: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Automation settings could not be saved.",
    };
  }
}
