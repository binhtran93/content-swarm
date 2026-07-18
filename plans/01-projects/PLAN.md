# Projects — Overall Plan

Status: Not started

## Goal

Create the smallest useful administrative foundation: the owner can create a
real editorial Project and associate it with one version-controlled public-site
configuration.

## User journey

```text
Open admin
→ View Projects
→ Create Project
→ Enter name and reusable AI description
→ Associate configured public site
→ Open project workspace
```

## Ownership

Projects owns:

- `projects/{projectId}`.
- Project ID, name, description, status, topics, and public-site association.
- Project list/create/edit/archive commands.
- Project selection and project availability checks.

Projects does not own public brand/theme configuration. R1 keeps that typed and
version-controlled under `src/public-site/config/`.

## Data flow

Inputs:

- Owner-entered project name and description.
- A known `publicSiteId` from source configuration.

Output:

- An active Project that downstream Keyword and Article features can use.
- Read-only public context: canonical origin, supported locales, default locale,
  topics, MDX contract ID, and install CTA.

## Implementation files

1. [Project management](./01-project-management.md)

## Shared rules

- Project ID is stable after creation.
- Project name is not its Firestore identity.
- Archived projects remain readable but reject new paid/editorial/publication
  commands.
- Unknown public-site configuration blocks article publication later.
- Public-site code never reads private project descriptions.

## Final demonstration

Create a real SubIQ project from the admin UI, associate `publicSiteId: "subiq"`,
refresh the page, reopen it, edit its description, and see its read-only domain
and locale configuration.

