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

export async function createProject(
  input: z.input<typeof projectInputSchemas.create>,
): Promise<Project> {
  const owner = await requireOwner();
  const validated = projectInputSchemas.create.parse(input);
  const reference = getServerFirestore()
    .collection("projects")
    .doc(validated.projectId);

  const document = await getServerFirestore().runTransaction(
    async (transaction) => {
      if ((await transaction.get(reference)).exists) {
        throw new ProjectServiceError(
          "conflict",
          "That project ID is already in use.",
        );
      }

      const now = Timestamp.now();
      const nextDocument = projectDocumentSchema.parse({
        schemaVersion: 1,
        ownerId: owner.uid,
        name: validated.name,
        description: validated.description,
        topics: validated.topics,
        status: "active",
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      });
      transaction.create(reference, nextDocument);
      return nextDocument;
    },
  );

  return toProject(validated.projectId, document);
}
