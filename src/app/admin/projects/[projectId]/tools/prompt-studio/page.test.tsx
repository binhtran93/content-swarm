import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PromptStudioPage from "@/app/admin/projects/[projectId]/tools/prompt-studio/page";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

vi.mock("@/features/projects/service/get-project-context.server", () => ({
  getProjectContext: vi.fn(),
}));

vi.mock("@/features/tools/backoffice/prompt-studio", () => ({
  PromptStudio: ({ project }: { project: { name: string } }) => (
    <div>Studio for {project.name}</div>
  ),
}));

vi.mock("@/backoffice/components/ui/page-title", () => ({
  PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const getProjectContextMock = vi.mocked(getProjectContext);

describe("Prompt Studio page", () => {
  it("loads the active Project context", async () => {
    getProjectContextMock.mockResolvedValueOnce({
      projectId: "urge-zero",
      name: "UrgeZero",
      description: "Private context",
      topics: ["recovery"],
      competitorDomains: [],
      acquisition: {
        mode: "waitlist",
        appStoreUrl: null,
        googlePlayUrl: null,
      },
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      archivedAt: null,
    });

    render(
      await PromptStudioPage({
        params: Promise.resolve({ projectId: "urge-zero" }),
      }),
    );

    expect(getProjectContextMock).toHaveBeenCalledWith("urge-zero");
    expect(screen.getByText("Studio for UrgeZero")).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "← Tools" }),
    ).not.toBeInTheDocument();
  });

  it("uses the non-disclosing unavailable state", async () => {
    getProjectContextMock.mockRejectedValueOnce(new Error("Unavailable"));

    render(
      await PromptStudioPage({
        params: Promise.resolve({ projectId: "unknown" }),
      }),
    );

    expect(screen.getByText("Project unavailable")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Back to projects" }),
    ).toHaveAttribute("href", "/admin/projects");
  });
});
