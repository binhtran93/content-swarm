import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { competitorDomainSchema } from "@/features/projects/model/competitor-domain";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { projectInputSchemas } from "@/features/projects/model/project-input";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function appendProjectCompetitor(
  projectId: string,
  input: string,
): Promise<void> {
  const owner = await requireOwner();
  const validatedProjectId = projectInputSchemas.projectId.parse(projectId);
  const competitorDomain = competitorDomainSchema.parse(input);
  const firestore = getServerFirestore();
  const reference = firestore.collection("projects").doc(validatedProjectId);

  await firestore.runTransaction(async (transaction) => {
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
    if (current.competitorDomains.includes(competitorDomain)) return;

    const nextDocument = projectDocumentSchema.parse({
      ...current,
      competitorDomains: [...current.competitorDomains, competitorDomain],
      updatedAt: Timestamp.now(),
    });
    transaction.set(reference, nextDocument);
  });
}
