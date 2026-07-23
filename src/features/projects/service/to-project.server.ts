import "server-only";

import type { z } from "zod";

import type { Project } from "@/features/projects/model/project";
import type { projectDocumentSchema } from "@/features/projects/model/project-document";

export function toProject(
  projectId: string,
  document: z.infer<typeof projectDocumentSchema>,
): Project {
  return {
    projectId,
    name: document.name,
    description: document.description,
    voiceTone: document.voiceTone,
    topics: document.topics,
    competitorDomains: document.competitorDomains,
    acquisition: document.acquisition,
    status: document.status,
    createdAt: document.createdAt.toDate().toISOString(),
    updatedAt: document.updatedAt.toDate().toISOString(),
    archivedAt: document.archivedAt?.toDate().toISOString() ?? null,
  };
}
