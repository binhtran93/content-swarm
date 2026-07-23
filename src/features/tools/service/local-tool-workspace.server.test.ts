import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { StoryboardJobManifest } from "@/features/tools/model/storyboard-splitter-job";
import {
  createStoryboardJobDirectory,
  listLocalStoryboardJobs,
  readStoryboardJobManifest,
  storyboardJobPath,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const jobId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";
let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(path.join(os.tmpdir(), "tool-workspace-test-"));
  process.env.MEDIA_TOOLS_WORKSPACE_DIR = workspace;
});

afterEach(async () => {
  delete process.env.MEDIA_TOOLS_WORKSPACE_DIR;
  await rm(workspace, { recursive: true, force: true });
});

describe("local storyboard workspace", () => {
  it("atomically stores and lists project-scoped manifests", async () => {
    await createStoryboardJobDirectory("urge-zero", jobId);
    const manifest = readyManifest();
    await writeStoryboardJobManifest(manifest);

    await expect(
      readStoryboardJobManifest("urge-zero", jobId),
    ).resolves.toEqual(manifest);
    await expect(listLocalStoryboardJobs("urge-zero")).resolves.toEqual([
      {
        jobId,
        name: "Urge storyboard",
        status: "ready",
        panelCount: 1,
        error: null,
        createdAt: "2026-07-23T03:00:00.000Z",
        updatedAt: "2026-07-23T03:01:00.000Z",
      },
    ]);
    await expect(listLocalStoryboardJobs("subiq")).resolves.toEqual([]);
  });

  it("rejects artifact paths that escape the job directory", () => {
    expect(() =>
      storyboardJobPath("urge-zero", jobId, "..", "..", "outside.png"),
    ).toThrow(ToolServiceError);
  });

  it("normalizes legacy version-one manifests when reading them", async () => {
    await createStoryboardJobDirectory("urge-zero", jobId);
    const legacy = {
      ...readyManifest(),
      schemaVersion: 1,
    };
    const versionOne: Record<string, unknown> = { ...legacy };
    delete versionOne.detectedBounds;
    delete versionOne.cropBounds;
    await writeFile(
      storyboardJobPath("urge-zero", jobId, "manifest.json"),
      JSON.stringify(versionOne),
      "utf8",
    );

    const normalized = await readStoryboardJobManifest("urge-zero", jobId);
    expect(normalized.schemaVersion).toBe(2);
    expect(normalized.detectedBounds).toEqual([
      { x: 10, y: 10, width: 280, height: 210 },
    ]);
    expect(normalized.cropBounds).toEqual(normalized.detectedBounds);
  });
});

function readyManifest(): StoryboardJobManifest {
  return {
    schemaVersion: 2,
    projectId: "urge-zero",
    jobId,
    name: "Urge storyboard",
    status: "ready",
    source: {
      originalName: "storyboard.png",
      contentType: "image/png",
      width: 900,
      height: 700,
    },
    panels: [
      {
        panelId: "panel-01",
        fileName: "panel-01.png",
        bounds: { x: 10, y: 10, width: 280, height: 210 },
        width: 1104,
        height: 824,
      },
    ],
    detectedBounds: [{ x: 10, y: 10, width: 280, height: 210 }],
    cropBounds: [{ x: 10, y: 10, width: 280, height: 210 }],
    panelCount: 1,
    hasOverlay: true,
    hasZip: true,
    error: null,
    createdAt: "2026-07-23T03:00:00.000Z",
    updatedAt: "2026-07-23T03:01:00.000Z",
  };
}
