import type { ProjectAcquisition } from "@/features/projects/model/project-acquisition";

export type Project = {
  projectId: string;
  name: string;
  description: string;
  topics: string[];
  acquisition: ProjectAcquisition;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};
