import "server-only";

import { unstable_cache } from "next/cache";

import {
  defaultProjectAcquisition,
  projectAcquisitionSchema,
  type ProjectAcquisition,
} from "@/features/projects/model/project-acquisition";
import { projectAcquisitionCacheTag } from "@/features/projects/public/project-acquisition-cache";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { isFullPublicProjectId } from "@/public-site/config/public-url";

function assertPublicProjectId(projectId: string): void {
  if (!isFullPublicProjectId(projectId)) {
    throw new Error(`Unknown public project: ${projectId}.`);
  }
}

export async function readPublicProjectAcquisition(
  projectId: string,
): Promise<ProjectAcquisition> {
  assertPublicProjectId(projectId);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .get();
  if (!snapshot.exists) {
    throw new Error(`Public project is unavailable: ${projectId}.`);
  }
  const result = projectAcquisitionSchema.safeParse(
    snapshot.data()?.acquisition,
  );
  return result.success ? result.data : { ...defaultProjectAcquisition };
}

export async function getPublicProjectAcquisition(
  projectId: string,
): Promise<ProjectAcquisition> {
  assertPublicProjectId(projectId);
  const readCached = unstable_cache(
    () => readPublicProjectAcquisition(projectId),
    ["public-project-acquisition", projectId],
    {
      tags: [projectAcquisitionCacheTag(projectId)],
      revalidate: 300,
    },
  );
  try {
    return await readCached();
  } catch {
    return { ...defaultProjectAcquisition };
  }
}
