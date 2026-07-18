"use client";

import { useActionState } from "react";

import { ProjectFormFields } from "@/features/projects/backoffice/project-form-fields";
import { updateProjectAction } from "@/features/projects/backoffice/update-project-action.server";
import type { Project } from "@/features/projects/model/project";

export function ProjectSettingsForm({ project }: { project: Project }) {
  const [state, action, pending] = useActionState(
    updateProjectAction.bind(null, project.projectId),
    null,
  );

  return (
    <form action={action} className="space-y-6">
      {state?.error ? (
        <div className="alert alert-error" role="alert">
          <span>{state.error}</span>
        </div>
      ) : null}
      <ProjectFormFields project={project} />
      <div className="border-base-300 flex justify-end border-t pt-5">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
