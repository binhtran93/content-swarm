# 01.01 — Project Management

Status: In progress

## Outcome

The owner can create, list, open, edit, and archive real projects. The next
feature receives a valid active `projectId` and public-site context.

## Depends on

- [Platform Foundation](../00-platform-foundation.md)
- [Owner Authentication](../00-owner-authentication.md)
- [Projects Overall Plan](./PLAN.md)

## Firestore ownership

Path: `projects/{projectId}`

```ts
type ProjectDocument = {
  schemaVersion: 1
  ownerId: string
  name: string
  description: string
  topics: string[]
  canonicalBaseUrl: string | null
  status: "active" | "archived"
  createdAt: Timestamp
  updatedAt: Timestamp
  archivedAt: Timestamp | null
}
```

Validation:

- `ownerId`: the verified Firebase UID returned by `requireOwner()`; assigned
  during creation, immutable, and never accepted in Project input.
- `projectId`: owner-selected stable lowercase route identifier such as
  `subiq`; validated at creation and immutable afterward.
- `name`: trimmed, 1–100 characters.
- `description`: trimmed, 1–5,000 characters; used as AI product context.
- `topics`: unique case-insensitively, trimmed, maximum 100, each maximum 80
  characters.
- `canonicalBaseUrl`: optional while editorial setup is in progress. When
  present it is absolute HTTPS, may include a project path such as
  `https://anmisoft.com/subiq`, and has no trailing slash. Publishing requires
  it.

Add the exact composite index required by the implemented Project list query:
`ownerId asc, updatedAt desc`. Do not add other speculative indexes.

## Commands

- `createProject(input)`
- `updateProject(projectId, input)`
- `archiveProject(projectId)`

Every command calls `requireOwner()` and verifies `Project.ownerId`. Normal
application/cloud logs handle technical failures; R1 has no separate Firestore
audit collection.

## Queries

- `listActiveProjects()` queries `ownerId == authenticated uid`, then orders by
  `updatedAt desc`.
- `getProject(projectId)`.
- `getProjectContext(projectId)` returning the validated Project data needed by
  downstream feature services.

## Backoffice behavior

Routes:

```text
/admin/projects
/admin/projects/new
/admin/projects/{projectId}/settings
```

- Projects page: responsive card list, recent first, New project primary action.
- Create: stable project ID, name, description, and optional canonical base URL.
- Settings: edit Project fields and canonical base URL; archive.
- Archive requires confirmation and explains that future commands stop.
- Loading, empty, invalid, unavailable, save failure, and success states are
  explicit.
- Build cards, forms, confirmation modal, buttons, alerts, and loading states
  with the owned Nexus-derived DaisyUI patterns under `src/backoffice`; do not
  copy an ecommerce demo page wholesale.

## Public behavior

Landing pages do not use the Project document as presentation configuration.
Site layout, theme, header, navigation, footer, content, and assets stay in
code. Server-side publishing reads `canonicalBaseUrl` and never exposes the
private Project description.

## AI behavior and prompt

None. The description becomes input for later article prompts, but Project
creation must not call AI.

## Planned implementation links

- [Project schema](../../src/features/projects/model/project-document.ts)
- [Project input](../../src/features/projects/model/project-input.ts)
- [Create Project](../../src/features/projects/service/create-project.server.ts)
- [Update Project](../../src/features/projects/service/update-project.server.ts)
- [Archive Project](../../src/features/projects/service/archive-project.server.ts)
- [List Projects](../../src/features/projects/service/list-active-projects.server.ts)
- [Get Project](../../src/features/projects/service/get-project.server.ts)
- [Get active Project context](../../src/features/projects/service/get-project-context.server.ts)
- [Projects page](../../src/app/admin/projects/page.tsx)
- [Project tests](../../src/features/projects/service/project-commands.test.ts)

## Implementation order

1. Implement document/input schemas and Firestore reader.
2. Implement queries and commands with `requireOwner()` and Project ownership
   validation.
3. Implement admin project shell and Projects list.
4. Implement Create and Settings with the optional canonical base URL.
5. Implement archive protection used by later feature services.
6. Add service, component, authorization, and cross-project isolation tests.

## Tangible output

Real Firestore Projects created through the admin UI and visible after refresh,
for example:

```text
projects/subiq
  ownerId: {firebase-owner-uid}
  name: SubIQ
  status: active
  canonicalBaseUrl: https://getsubiq.com
```

Keyword Research can now scope all work independently to each Project.

Create separate Project documents for each product workspace. Do not store all
brands as one Project or share keyword/article subcollections across products.

## Verification

- Create and edit survive refresh.
- Project creation assigns `ownerId` from the session, not request input.
- Project lists and direct reads reject another owner's Project.
- An invalid non-null canonical base URL is rejected on the server.
- Crafted cross-project routes do not expose another project.
- Archived project is visible in settings but not selectable for new work.
- No project description appears in a public response.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The SubIQ Project and at least one additional product Project exist as real
  isolated data.
- Their admin screens work on desktop and mobile.
- Each publication-ready Project resolves to its own canonical base URL.
- Archive prevents a representative downstream command in an integration test.
