import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import type { z } from "zod";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { projectInputSchemas } from "@/features/projects/model/project-input";
import type { Project } from "@/features/projects/model/project";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { toProject } from "@/features/projects/service/to-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function updateProject(
  projectId: string,
  input: z.input<typeof projectInputSchemas.update>,
): Promise<Project> {
  const owner = await requireOwner();
  const validatedProjectId = projectInputSchemas.projectId.parse(projectId);
  const validated = projectInputSchemas.update.parse(input);
  const reference = getServerFirestore()
    .collection("projects")
    .doc(validatedProjectId);

  const document = await getServerFirestore().runTransaction(
    async (transaction) => {
      const snapshot = await transaction.get(reference);
      const current = readFirestoreDocument(projectDocumentSchema, snapshot);
      if (!current || current.ownerId !== owner.uid) {
        throw new ProjectServiceError("unavailable", "Project is unavailable.");
      }
      if (current.status === "archived") {
        throw new ProjectServiceError(
          "archived",
          "Archived projects cannot be changed.",
        );
      }

      const nextDocument = projectDocumentSchema.parse({
        ...current,
        name: validated.name,
        description: validated.description,
        topics: validated.topics,
        acquisition: validated.acquisition,
        updatedAt: Timestamp.now(),
      });
      transaction.set(reference, nextDocument);
      return nextDocument;
    },
  );

  return toProject(validatedProjectId, document);
}
