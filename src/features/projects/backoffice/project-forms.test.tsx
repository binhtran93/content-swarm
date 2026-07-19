import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArchiveProjectControl } from "@/features/projects/backoffice/archive-project-control";
import { CreateProjectForm } from "@/features/projects/backoffice/create-project-form";
import { ProjectSettingsForm } from "@/features/projects/backoffice/project-settings-form";

vi.mock("@/features/projects/backoffice/create-project-action.server", () => ({
  createProjectAction: vi.fn(),
}));
vi.mock("@/features/projects/backoffice/update-project-action.server", () => ({
  updateProjectAction: vi.fn(),
}));
vi.mock("@/features/projects/backoffice/archive-project-action.server", () => ({
  archiveProjectAction: vi.fn(),
}));

const project = {
  projectId: "subiq",
  name: "SubIQ",
  description: "Private product context",
  topics: ["SaaS"],
  acquisition: {
    mode: "waitlist" as const,
    appStoreUrl: null,
    googlePlayUrl: null,
  },
  status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  archivedAt: null,
};

describe("Project backoffice forms", () => {
  it("explains immutable IDs and private descriptions during creation", () => {
    render(<CreateProjectForm />);

    expect(screen.getByLabelText("Project ID")).toBeRequired();
    expect(screen.getByText(/cannot be changed later/i)).toBeInTheDocument();
    expect(screen.getByText(/never public/i)).toBeInTheDocument();
  });

  it("renders persisted settings and keeps the project ID disabled", () => {
    render(<ProjectSettingsForm project={project} />);

    expect(screen.getByDisplayValue("subiq")).toBeDisabled();
    expect(screen.getByDisplayValue("SubIQ")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SaaS")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Waitlist" })).toBeChecked();
    expect(screen.getByLabelText("App Store URL")).toHaveValue("");
    expect(screen.getByLabelText("Google Play URL")).toHaveValue("");
  });

  it("requires an explicit archive confirmation with impact copy", () => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    render(<ArchiveProjectControl projectId="subiq" projectName="SubIQ" />);
    fireEvent.click(screen.getByRole("button", { name: "Archive project" }));

    expect(screen.getByText("Archive SubIQ?")).toBeInTheDocument();
    expect(
      screen.getByText(/existing public pages stay online/i),
    ).toBeInTheDocument();
  });
});
