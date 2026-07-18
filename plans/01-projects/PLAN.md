# Projects — Overall Plan

Status: Not started

## Goal

Create the smallest useful multi-product foundation: the owner can create real
editorial Projects with only the operational public-site data required by
publishing.

## User journey

```text
Open admin
→ Sign in as the owner when required
→ View Projects
→ Create Project
→ Enter name and reusable AI description
→ Optionally enter its canonical base URL
→ Open project workspace
```

## Ownership

Projects owns:

- `projects/{projectId}`.
- Owner ID, Project ID, name, description, status, topics, and minimal
  public-site fields.
- Project list/create/edit/archive commands.
- Project selection and project availability checks.

Projects does not own landing-page presentation. Each public site owns its
theme, content, composition, navigation, and assets in code.

Project screens use the owned Nexus-derived backoffice shell and DaisyUI
patterns. They must not import components directly from `/nexus`.

## Data flow

Inputs:

- Verified owner UID from `requireOwner()`.
- Owner-entered project name and description.
- Owner-entered optional canonical base URL.

Output:

- An active Project that downstream Keyword and Article features can use.
- A canonical base URL that publishing can use to build exact public URLs.

## Implementation files

1. [Project Management](./01-project-management.md)

## Shared rules

- Project ID is stable after creation.
- Project `ownerId` is assigned from the authenticated owner and is immutable.
- Every query and command verifies ownership before returning Project data.
- Project name is not its Firestore identity.
- Archived projects remain readable but reject new paid/editorial/publication
  commands.
- Archiving a Project does not take its coded website offline or remove existing
  public articles. Article archive and deployment routing are separate explicit
  operations.
- A missing canonical base URL blocks publication, but not authoring.
- Public-site code never reads private project descriptions.
- Project presentation is explicit code under `src/public-site/sites/{projectId}`;
  there is no template registry or database-driven page builder.

## Final demonstration

Create real Projects for SubIQ and at least one additional product from the
admin UI, configure their canonical base URLs, refresh, reopen them, and prove
publishing resolves each Project's own URL.
