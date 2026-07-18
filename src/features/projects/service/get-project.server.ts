import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { projectInputSchemas } from "@/features/projects/model/project-input";
import type { Project } from "@/features/projects/model/project";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { toProject } from "@/features/projects/service/to-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function getProject(projectId: string): Promise<Project> {
  const owner = await requireOwner();
  const validatedProjectId = projectInputSchemas.projectId.parse(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(validatedProjectId)
    .get();
  const document = readFirestoreDocument(projectDocumentSchema, snapshot);
  if (!document || document.ownerId !== owner.uid) {
    throw new ProjectServiceError("unavailable", "Project is unavailable.");
  }
  return toProject(validatedProjectId, document);
}
