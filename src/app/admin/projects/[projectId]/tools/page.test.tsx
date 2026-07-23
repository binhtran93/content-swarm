import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ToolsPage from "@/app/admin/projects/[projectId]/tools/page";

vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: vi.fn().mockResolvedValue({ id: "urge-zero" }),
}));

describe("Project tools page", () => {
  it("links to the YouTube Audio Extractor", async () => {
    render(
      await ToolsPage({
        params: Promise.resolve({ projectId: "urge-zero" }),
      }),
    );
    expect(
      screen.getByRole("link", { name: /YouTube Audio Extractor/ }),
    ).toHaveAttribute("href", "/admin/projects/urge-zero/tools/youtube-audio");
  });
});
