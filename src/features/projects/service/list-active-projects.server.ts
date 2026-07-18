import "server-only";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { projectDocumentSchema } from "@/features/projects/model/project-document";
import type { Project } from "@/features/projects/model/project";
import { toProject } from "@/features/projects/service/to-project.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function listActiveProjects(): Promise<Project[]> {
  const owner = await requireOwner();
  const snapshot = await getServerFirestore()
    .collection("projects")
    .where("ownerId", "==", owner.uid)
    .orderBy("updatedAt", "desc")
    .get();

  return snapshot.docs
    .map((item) => ({
      projectId: item.id,
      document: readFirestoreDocument(projectDocumentSchema, item),
    }))
    .filter(
      (item) =>
        item.document?.ownerId === owner.uid &&
        item.document.status === "active",
    )
    .map((item) => toProject(item.projectId, item.document!));
}
