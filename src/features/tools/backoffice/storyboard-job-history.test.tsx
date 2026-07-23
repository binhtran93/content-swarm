import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StoryboardJobHistory } from "@/features/tools/backoffice/storyboard-job-history";

vi.mock("@/features/tools/backoffice/storyboard-job-delete-button", () => ({
  StoryboardJobDeleteButton: () => <button type="button">Delete</button>,
}));

describe("StoryboardJobHistory", () => {
  it("shows the empty local-history state", () => {
    render(<StoryboardJobHistory jobs={[]} projectId="urge-zero" />);
    expect(screen.getByText("No processed storyboards yet")).toBeVisible();
  });

  it("links a completed job to its project-scoped workspace", () => {
    render(
      <StoryboardJobHistory
        jobs={[
          {
            jobId: "8f6d717d-56d5-4f62-9254-08aeb4d92d31",
            name: "Urge storyboard",
            status: "ready",
            panelCount: 14,
            error: null,
            createdAt: "2026-07-23T03:00:00.000Z",
            updatedAt: "2026-07-23T03:01:00.000Z",
          },
        ]}
        projectId="urge-zero"
      />,
    );

    expect(
      screen.getByRole("link", { name: "Urge storyboard" }),
    ).toHaveAttribute(
      "href",
      "/admin/projects/urge-zero/tools/storyboard-splitter/8f6d717d-56d5-4f62-9254-08aeb4d92d31",
    );
    expect(screen.getByText("14")).toBeVisible();
  });
});
