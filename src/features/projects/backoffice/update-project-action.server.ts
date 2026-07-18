"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { updateProject } from "@/features/projects/service/update-project.server";

type ActionState = { error: string } | null;

export async function updateProjectAction(
  projectId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await updateProject(projectId, {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      canonicalBaseUrl: String(formData.get("canonicalBaseUrl") ?? ""),
      topics: String(formData.get("topics") ?? "")
        .split(/[\n,]/)
        .map((topic) => topic.trim())
        .filter(Boolean),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.issues[0]?.message ?? "Check the project details.",
      };
    }
    if (error instanceof ProjectServiceError) return { error: error.message };
    return { error: "Changes could not be saved. Please try again." };
  }

  redirect(`/admin/projects/${projectId}/settings`);
}
