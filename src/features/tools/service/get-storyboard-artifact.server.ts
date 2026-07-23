import "server-only";

import { readFile } from "node:fs/promises";

import { getStoryboardJob } from "@/features/tools/service/storyboard-jobs.server";
import { storyboardJobPath } from "@/features/tools/service/local-tool-workspace.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

export async function getStoryboardArtifact(
  projectId: string,
  jobId: string,
  artifactId: string,
) {
  const manifest = await getStoryboardJob(projectId, jobId);
  let relativePath: string;
  let fileName: string;
  let contentType: string;

  if (artifactId === "source") {
    relativePath = "source.png";
    fileName = "source.png";
    contentType = "image/png";
  } else if (artifactId === "overlay" && manifest.hasOverlay) {
    relativePath = "detection-overlay.png";
    fileName = "detection-overlay.png";
    contentType = "image/png";
  } else if (artifactId === "zip" && manifest.hasZip) {
    relativePath = "panels.zip";
    fileName = `${safeDownloadBase(manifest.name)}-panels.zip`;
    contentType = "application/zip";
  } else {
    const panel = manifest.panels.find(
      (candidate) => candidate.panelId === artifactId,
    );
    if (!panel || manifest.status !== "ready") {
      throw new ToolServiceError("not-found", "Artifact is unavailable.");
    }
    relativePath = `enhanced-panels/${panel.fileName}`;
    fileName = panel.fileName;
    contentType = "image/png";
  }

  try {
    return {
      contents: await readFile(
        /*turbopackIgnore: true*/ storyboardJobPath(
          projectId,
          jobId,
          relativePath,
        ),
      ),
      fileName,
      contentType,
    };
  } catch {
    throw new ToolServiceError("not-found", "Artifact is unavailable.");
  }
}

function safeDownloadBase(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || "storyboard";
}
