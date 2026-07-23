import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StoryboardJobManifest } from "@/features/tools/model/storyboard-splitter-job";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import {
  createStoryboardJobDirectory,
  writeStoryboardJobManifest,
} from "@/features/tools/service/local-tool-workspace.server";
import { saveStoryboardCrops } from "@/features/tools/service/storyboard-jobs.server";

vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: vi.fn().mockResolvedValue({}),
}));

const jobId = "8f6d717d-56d5-4f62-9254-08aeb4d92d31";
let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(path.join(os.tmpdir(), "storyboard-jobs-test-"));
  process.env.MEDIA_TOOLS_WORKSPACE_DIR = workspace;
  await createStoryboardJobDirectory("urge-zero", jobId);
  await writeStoryboardJobManifest(reviewManifest());
});

afterEach(async () => {
  delete process.env.MEDIA_TOOLS_WORKSPACE_DIR;
  await rm(workspace, { recursive: true, force: true });
});

describe("storyboard crop jobs", () => {
  it("saves validated rectangles through the project authorization boundary", async () => {
    const rectangles = [{ x: 20, y: 25, width: 250, height: 180 }];

    const updated = await saveStoryboardCrops("urge-zero", jobId, rectangles);

    expect(getProjectContext).toHaveBeenCalledWith("urge-zero");
    expect(updated.status).toBe("review");
    expect(updated.cropBounds).toEqual(rectangles);
  });

  it("rejects rectangles outside the source image", async () => {
    await expect(
      saveStoryboardCrops("urge-zero", jobId, [
        { x: 500, y: 20, width: 200, height: 180 },
      ]),
    ).rejects.toEqual(
      expect.objectContaining({
        code: "invalid",
        message: "Every crop rectangle must stay inside the source image.",
      }),
    );
  });

  it("rejects empty and undersized rectangle sets", async () => {
    await expect(saveStoryboardCrops("urge-zero", jobId, [])).rejects.toThrow();
    await expect(
      saveStoryboardCrops("urge-zero", jobId, [
        { x: 10, y: 10, width: 10, height: 10 },
      ]),
    ).rejects.toThrow();
  });

  it("rejects more than 200 rectangles", async () => {
    await expect(
      saveStoryboardCrops(
        "urge-zero",
        jobId,
        Array.from({ length: 201 }, () => ({
          x: 10,
          y: 10,
          width: 20,
          height: 20,
        })),
      ),
    ).rejects.toThrow();
  });

  it("does not bypass project authorization", async () => {
    vi.mocked(getProjectContext).mockRejectedValueOnce(
      new Error("Not authorized"),
    );

    await expect(
      saveStoryboardCrops("urge-zero", jobId, [
        { x: 10, y: 10, width: 200, height: 150 },
      ]),
    ).rejects.toThrow("Not authorized");
  });

  it("keeps completed results available while crop edits are saved", async () => {
    await writeStoryboardJobManifest({
      ...reviewManifest(),
      status: "ready",
      hasZip: true,
    });

    const updated = await saveStoryboardCrops("urge-zero", jobId, [
      { x: 20, y: 20, width: 250, height: 180 },
    ]);

    expect(updated.status).toBe("ready");
    expect(updated.hasZip).toBe(true);
    expect(updated.cropBounds[0]?.x).toBe(20);
  });
});

function reviewManifest(): StoryboardJobManifest {
  const bounds = { x: 10, y: 10, width: 280, height: 210 };
  return {
    schemaVersion: 2,
    projectId: "urge-zero",
    jobId,
    name: "Urge storyboard",
    status: "review",
    source: {
      originalName: "storyboard.png",
      contentType: "image/png",
      width: 600,
      height: 500,
    },
    panels: [],
    detectedBounds: [bounds],
    cropBounds: [bounds],
    panelCount: 1,
    hasOverlay: true,
    hasZip: false,
    error: null,
    createdAt: "2026-07-23T03:00:00.000Z",
    updatedAt: "2026-07-23T03:01:00.000Z",
  };
}
