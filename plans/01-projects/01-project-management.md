# 01.01 — Project Management

Status: Not started

## Outcome

The owner can create, list, open, edit, and archive real projects. The next
feature receives a valid active `projectId` and public-site context.

## Depends on

- [Platform Foundation](../00-platform-foundation.md)
- [Projects Overall Plan](./PLAN.md)

## Firestore ownership

Path: `projects/{projectId}`

```ts
type ProjectDocument = {
  schemaVersion: 1
  name: string
  description: string
  publicSiteId: string
  topics: string[]
  status: "active" | "archived"
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  archivedAt: Timestamp | null
}
```

Validation:

- `projectId`: generated stable ID or validated lowercase identifier; decide
  once before implementation.
- `name`: trimmed, 1–100 characters.
- `description`: trimmed, 1–5,000 characters; used as AI product context.
- `publicSiteId`: must exist in the typed public-site registry.
- `topics`: unique case-insensitively, trimmed, maximum 100, each maximum 80
  characters.

Required indexes: none beyond document reads and ordering by `updatedAt` if the
project count justifies a query. Do not add speculative indexes.

## Commands

- `createProject(input)`
- `updateProject(projectId, input)`
- `archiveProject(projectId)`

Every command validates the authenticated actor and appends an audit event for
create/archive. Editing description need not create a verbose audit event in R1.

## Queries

- `listActiveProjects()` ordered by `updatedAt desc`.
- `getProject(projectId)`.
- `getProjectContext(projectId)` combining the project with source-controlled
  public-site configuration.

## Backoffice behavior

Routes:

```text
/admin/projects
/admin/projects/new
/admin/projects/{projectId}/settings
```

- Projects page: responsive card list, recent first, New project primary action.
- Create: name, description, public-site selector.
- Settings: edit fields, read-only public domain/locales/contract, archive.
- Archive requires confirmation and explains that future commands stop.
- Loading, empty, invalid, unavailable, save failure, and success states are
  explicit.

## Public behavior

None. Public-site configuration stays version-controlled, and no public page
needs a Project Firestore read yet.

## AI behavior and prompt

None. The description becomes input for later article prompts, but Project
creation must not call AI.

## Planned implementation links

- [Project schema](../../src/features/projects/model/project-document.ts)
- [Project input](../../src/features/projects/model/project-input.ts)
- [Project service](../../src/features/projects/service/project-service.server.ts)
- [Public-site registry](../../src/public-site/config/site-registry.ts)
- [Projects page](../../src/app/admin/projects/page.tsx)
- [Project tests](../../src/features/projects/service/project-service.test.ts)

## Implementation order

1. Implement typed public-site registry with SubIQ configuration adapted from
   `tdbinh`.
2. Implement document/input schemas and Firestore reader.
3. Implement queries and commands with actor/project validation.
4. Implement admin project shell and Projects list.
5. Implement Create and Settings.
6. Implement archive protection used by later feature services.
7. Add service, component, authorization, and isolation tests.

## Tangible output

A real Firestore Project created through the admin UI and visible after refresh:

```text
projects/{realProjectId}
  name: SubIQ
  publicSiteId: subiq
  status: active
```

Keyword Research can now scope all work to this project.

## Verification

- Create and edit survive refresh.
- Invalid/unknown `publicSiteId` is rejected on the server.
- Crafted cross-project routes do not expose another project.
- Archived project is visible in settings but not selectable for new work.
- No project description appears in a public response.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The SubIQ project exists as real data.
- Its admin screens work on desktop and mobile.
- Its source configuration is resolvable.
- Archive prevents a representative downstream command in an integration test.

