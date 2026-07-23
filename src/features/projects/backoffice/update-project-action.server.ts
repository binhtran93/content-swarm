"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { projectAcquisitionSchema } from "@/features/projects/model/project-acquisition";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { updateProject } from "@/features/projects/service/update-project.server";
import { projectAcquisitionCacheTag } from "@/features/projects/public/project-acquisition-cache";

type ActionState = { error: string } | null;

export async function updateProjectAction(
  projectId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const acquisition = projectAcquisitionSchema.parse({
      mode: String(formData.get("acquisitionMode") ?? "waitlist"),
      appStoreUrl: String(formData.get("appStoreUrl") ?? ""),
      googlePlayUrl: String(formData.get("googlePlayUrl") ?? ""),
    });
    await updateProject(projectId, {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      voiceTone: String(formData.get("voiceTone") ?? ""),
      acquisition,
      topics: String(formData.get("topics") ?? "")
        .split(/[\n,]/)
        .map((topic) => topic.trim())
        .filter(Boolean),
      competitorDomains: String(formData.get("competitorDomains") ?? "")
        .split(/\r?\n/)
        .map((domain) => domain.trim())
        .filter(Boolean),
    });
    updateTag(projectAcquisitionCacheTag(projectId));
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
