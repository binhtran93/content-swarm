"use server";

import { redirect } from "next/navigation";

import { archiveProject } from "@/features/projects/service/archive-project.server";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";

type ActionState = { error: string } | null;

export async function archiveProjectAction(
  projectId: string,
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;
  try {
    await archiveProject(projectId);
  } catch (error) {
    if (error instanceof ProjectServiceError) return { error: error.message };
    return { error: "The project could not be archived. Please try again." };
  }

  redirect("/admin/projects?archived=1");
}
