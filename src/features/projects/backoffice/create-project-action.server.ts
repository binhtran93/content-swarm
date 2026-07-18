"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createProject } from "@/features/projects/service/create-project.server";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";

type ActionState = { error: string } | null;

export async function createProjectAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let projectId: string;
  try {
    const project = await createProject({
      projectId: String(formData.get("projectId") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      canonicalBaseUrl: String(formData.get("canonicalBaseUrl") ?? ""),
    });
    projectId = project.projectId;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.issues[0]?.message ?? "Check the project details.",
      };
    }
    if (error instanceof ProjectServiceError) return { error: error.message };
    return { error: "The project could not be created. Please try again." };
  }

  redirect(`/admin/projects/${projectId}/settings?created=1`);
}
