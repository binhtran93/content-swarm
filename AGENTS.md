# Repository guidance

## Source of truth

Use sources in this order:

1. Production code, schemas, tests, and runtime configuration.
2. Durable architecture guidance under `docs/architecture/`.
3. Operational procedures under `docs/operations/`.

Do not recreate implementation plans that duplicate behavior already enforced by
code and tests.

## Adding a Project

Before creating or changing a Project, read `docs/operations/add-project.md`
completely. Treat Project work as two separate phases:

1. Phase 1 is required: create the central Firestore workspace and publish its
   Support, Privacy, and Terms pages on the ANMISOFT subpath.
2. Phase 2 is optional: add a full landing site on either the ANMISOFT subpath
   or a dedicated domain.

A request to "add a Project" means Phase 1 unless the user explicitly requests
a landing page, full public site, or dedicated domain. Do not make Phase 1 wait
for Phase 2 decisions or assets.

Use one permanent `projectId` consistently across Firestore paths, source
folders, routes, deployment variables, cache keys, and analytics configuration.
Document any historical alias explicitly.

## Working safely

- Preserve unrelated worktree and index changes.
- Never expose Firebase Admin credentials, service-account keys, or provider
  secrets in source, tests, documentation, logs, or chat output.
- Keep public reads scoped to the requested Project and published content.
- Do not let an unknown dedicated deployment fall back to another Project.
- Do not enable Project website analytics on an ANMISOFT subpath.
- Run `npm run check` for completed changes. For dedicated public-site changes,
  also run the Project-specific production build documented in the Add Project
  guide.
