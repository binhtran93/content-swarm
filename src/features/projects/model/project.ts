export type Project = {
  projectId: string;
  name: string;
  description: string;
  topics: string[];
  canonicalBaseUrl: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};
