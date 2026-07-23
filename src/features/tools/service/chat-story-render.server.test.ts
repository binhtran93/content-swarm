import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import {
  createChatStoryRender,
  getChatStoryRender,
  getChatStoryVideo,
  processChatStoryRender,
} from "@/features/tools/service/chat-story-render.server";

vi.mock("server-only", () => ({}));
vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: vi.fn(),
}));
vi.mock("@remotion/bundler", () => ({
  bundle: vi.fn().mockResolvedValue("/tmp/remotion-bundle"),
}));
vi.mock("@remotion/renderer", () => ({
  makeCancelSignal: () => ({
    cancelSignal: vi.fn(),
    cancel: vi.fn(),
  }),
  selectComposition: vi.fn().mockResolvedValue({
    id: "ChatStory",
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 1_245,
  }),
  renderMedia: vi.fn(
    async ({
      outputLocation,
      onProgress,
    }: {
      outputLocation: string;
      onProgress: (value: { progress: number }) => void;
    }) => {
      onProgress({ progress: 0.5 });
      await mkdir(path.dirname(outputLocation), { recursive: true });
      await writeFile(outputLocation, "mp4");
    },
  ),
}));

let workspace: string;

function validScript() {
  return {
    version: 1,
    title: "A Dangerous / Title",
    participants: [
      { id: "left", displayName: "Maya" },
      { id: "right", displayName: "Noah" },
    ],
    messages: Array.from({ length: 20 }, (_, index) => ({
      id: `m${index + 1}`,
      senderId: index % 2 ? "right" : "left",
      text: `Message ${index + 1}`,
      waitMs: 500,
      typingMs: 1_500,
      sound: index === 18 ? "reveal" : index % 2 ? "outgoing" : "incoming",
    })),
  };
}

beforeEach(async () => {
  workspace = await mkdtemp(path.join(os.tmpdir(), "chat-story-render-test-"));
  process.env.MEDIA_TOOLS_WORKSPACE_DIR = workspace;
  vi.mocked(getProjectContext).mockResolvedValue({} as never);
});

afterEach(async () => {
  delete process.env.MEDIA_TOOLS_WORKSPACE_DIR;
  await rm(workspace, { recursive: true, force: true });
  vi.clearAllMocks();
});

describe("chat story rendering", () => {
  it("creates, renders, and exposes a Project-scoped MP4", async () => {
    const created = await createChatStoryRender("urge-zero", validScript());
    expect(created.status).toBe("queued");

    const completed = await processChatStoryRender("urge-zero", created.jobId);
    expect(completed).toMatchObject({ status: "completed", progress: 1 });
    expect(completed.fileName).toMatch(/^a-dangerous-title-.*\.mp4$/);

    const video = await getChatStoryVideo("urge-zero", created.jobId);
    expect(video.size).toBe(3);
    expect(video.path).toContain(
      path.join("projects", "urge-zero", "chat-story-studio"),
    );
  });

  it("checks Project ownership before returning job state", async () => {
    const created = await createChatStoryRender("urge-zero", validScript());
    vi.mocked(getProjectContext).mockRejectedValueOnce(
      new Error("Not authorized"),
    );

    await expect(
      getChatStoryRender("urge-zero", created.jobId),
    ).rejects.toThrow("Not authorized");
  });
});
