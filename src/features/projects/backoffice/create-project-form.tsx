"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { createProjectAction } from "@/features/projects/backoffice/create-project-action.server";
import { ProjectFormFields } from "@/features/projects/backoffice/project-form-fields";

export function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProjectAction, null);

  return (
    <form action={action} className="space-y-2">
      <ErrorToast message={state?.error} />
      <ProjectFormFields includeProjectId />
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Link className="btn btn-ghost" href="/admin/projects">
          Cancel
        </Link>
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {pending ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}
