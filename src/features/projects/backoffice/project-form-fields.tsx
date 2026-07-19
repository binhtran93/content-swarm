import type { Project } from "@/features/projects/model/project";

export function ProjectFormFields({
  project,
  includeProjectId = false,
}: {
  project?: Project;
  includeProjectId?: boolean;
}) {
  return (
    <>
      {includeProjectId ? (
        <fieldset className="fieldset">
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
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Project ID</legend>
          <input
            aria-label="Project ID"
            className="input w-full"
            disabled
            value={project?.projectId ?? ""}
          />
          <p className="label">This stable identifier cannot be changed.</p>
        </fieldset>
      )}

      <fieldset className="fieldset">
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

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Description
          <span className="font-normal opacity-60">(optional)</span>
        </legend>
        <textarea
          aria-label="Description"
          aria-describedby="description-help"
          className="textarea min-h-36 w-full"
          defaultValue={project?.description}
          maxLength={5_000}
          name="description"
          placeholder="Describe the product, its audience, and the value it provides."
        />
        <p className="label" id="description-help">
          Private reusable context for later editorial AI. You can add it later;
          it is never public.
        </p>
      </fieldset>

      {project ? (
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Topics</legend>
          <textarea
            aria-label="Topics"
            aria-describedby="topics-help"
            className="textarea min-h-28 w-full"
            defaultValue={project.topics.join("\n")}
            name="topics"
            placeholder={"SEO\nContent marketing"}
          />
          <p className="label" id="topics-help">
            Up to 100 unique topics, separated by commas or new lines.
          </p>
        </fieldset>
      ) : null}
    </>
  );
}
