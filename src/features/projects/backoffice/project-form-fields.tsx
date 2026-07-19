"use client";

import { useState } from "react";

import type { Project } from "@/features/projects/model/project";

export function ProjectFormFields({
  project,
  includeProjectId = false,
}: {
  project?: Project;
  includeProjectId?: boolean;
}) {
  const [acquisitionMode, setAcquisitionMode] = useState(
    project?.acquisition.mode ?? "waitlist",
  );

  return (
    <>
      {includeProjectId ? (
        <fieldset className="fieldset gap-1.5">
          <legend className="fieldset-legend">Project ID</legend>
          <input
            aria-label="Project ID"
            aria-describedby="project-id-help"
            autoComplete="off"
            className="input w-full"
            maxLength={63}
            name="projectId"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="subiq"
            required
          />
          <p className="label" id="project-id-help">
            Permanent lowercase route ID. It cannot be changed later.
          </p>
        </fieldset>
      ) : (
        <fieldset className="fieldset gap-1.5">
          <legend className="fieldset-legend">Project ID</legend>
          <input
            aria-label="Project ID"
            className="input w-full"
            disabled
            value={project?.projectId ?? ""}
          />
        </fieldset>
      )}

      <fieldset className="fieldset gap-1.5">
        <legend className="fieldset-legend">Name</legend>
        <input
          aria-label="Name"
          autoComplete="organization"
          className="input w-full"
          defaultValue={project?.name}
          maxLength={100}
          name="name"
          placeholder="SubIQ"
          required
        />
      </fieldset>

      <fieldset className="fieldset gap-1.5">
        <legend className="fieldset-legend">
          Description
          <span className="font-normal opacity-60">(optional)</span>
        </legend>
        <textarea
          aria-label="Description"
          className="textarea min-h-24 w-full"
          defaultValue={project?.description}
          maxLength={5_000}
          name="description"
          placeholder="Describe the product, its audience, and the value it provides."
        />
      </fieldset>

      {project ? (
        <>
          <fieldset className="fieldset gap-1.5">
            <legend className="fieldset-legend">App availability</legend>
            <div className="join w-fit">
              <label className="btn join-item has-checked:btn-primary">
                <input
                  className="sr-only"
                  defaultChecked={project.acquisition.mode === "waitlist"}
                  name="acquisitionMode"
                  onChange={() => setAcquisitionMode("waitlist")}
                  type="radio"
                  value="waitlist"
                />
                Waitlist
              </label>
              <label className="btn join-item has-checked:btn-primary">
                <input
                  className="sr-only"
                  defaultChecked={project.acquisition.mode === "stores"}
                  name="acquisitionMode"
                  onChange={() => setAcquisitionMode("stores")}
                  type="radio"
                  value="stores"
                />
                App stores
              </label>
            </div>
            <p className="label max-w-xl leading-relaxed">
              {acquisitionMode === "waitlist"
                ? "Download actions will collect email signups."
                : "Add at least one store URL for download actions."}
            </p>
          </fieldset>

          {acquisitionMode === "stores" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="fieldset gap-1.5">
                <legend className="fieldset-legend">
                  App Store URL
                  <span className="font-normal opacity-60">(optional)</span>
                </legend>
                <input
                  aria-label="App Store URL"
                  autoCapitalize="none"
                  autoComplete="url"
                  className="input w-full"
                  defaultValue={project.acquisition.appStoreUrl ?? ""}
                  inputMode="url"
                  name="appStoreUrl"
                  placeholder="https://apps.apple.com/app/id…"
                  type="url"
                />
              </fieldset>

              <fieldset className="fieldset gap-1.5">
                <legend className="fieldset-legend">
                  Google Play URL
                  <span className="font-normal opacity-60">(optional)</span>
                </legend>
                <input
                  aria-label="Google Play URL"
                  autoCapitalize="none"
                  autoComplete="url"
                  className="input w-full"
                  defaultValue={project.acquisition.googlePlayUrl ?? ""}
                  inputMode="url"
                  name="googlePlayUrl"
                  placeholder="https://play.google.com/store/apps/details?id=…"
                  type="url"
                />
              </fieldset>
            </div>
          ) : (
            <>
              <input
                name="appStoreUrl"
                type="hidden"
                value={project.acquisition.appStoreUrl ?? ""}
              />
              <input
                name="googlePlayUrl"
                type="hidden"
                value={project.acquisition.googlePlayUrl ?? ""}
              />
            </>
          )}

          <fieldset className="fieldset gap-1.5">
            <legend className="fieldset-legend">Topics</legend>
            <textarea
              aria-label="Topics"
              className="textarea min-h-20 w-full"
              defaultValue={project.topics.join("\n")}
              name="topics"
              placeholder={"SEO\nContent marketing"}
            />
          </fieldset>
        </>
      ) : null}
    </>
  );
}
