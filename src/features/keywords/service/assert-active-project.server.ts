import "server-only";

import type { Transaction } from "firebase-admin/firestore";

import { projectDocumentSchema } from "@/features/projects/model/project-document";
import { ProjectServiceError } from "@/features/projects/service/project-service-error";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function assertActiveProject(
  transaction: Transaction,
  projectId: string,
  ownerId: string,
) {
  const reference = getServerFirestore().collection("projects").doc(projectId);
  const document = readFirestoreDocument(
    projectDocumentSchema,
    await transaction.get(reference),
  );
  if (!document || document.ownerId !== ownerId) {
    throw new ProjectServiceError("unavailable", "Project is unavailable.");
  }
  if (document.status !== "active") {
    throw new ProjectServiceError(
      "archived",
      "Archived projects cannot be changed.",
    );
  }
}
