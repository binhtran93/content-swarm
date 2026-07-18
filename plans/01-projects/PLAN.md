# Projects — Overall Plan

Status: Not started

## Goal

Create the smallest useful multi-product foundation: the owner can create real
editorial Projects and associate each with one version-controlled public-site
configuration.

## User journey

```text
Open admin
→ View Projects
→ Create Project
→ Enter name and reusable AI description
→ Associate SubIQ, Jewelry Identifier, SkyLens, Urge Zero, or another configured site
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

Project screens use the owned Nexus-derived backoffice shell and DaisyUI
patterns. They must not import components directly from `/nexus`.

## Data flow

Inputs:

- Owner-entered project name and description.
- A known `publicSiteId` from source configuration.

Output:

- An active Project that downstream Keyword and Article features can use.
- Read-only public context: canonical base URL, supported locales, default locale,
  topics, MDX contract ID, and install CTA.
- A registry of independently configured public products that shared Public
  Experience services can resolve by `projectId`.

## Implementation files

1. [Public Site Registry](./00-public-site-registry.md)
2. [Project Management](./01-project-management.md)

## Shared rules

- Project ID is stable after creation.
- Project name is not its Firestore identity.
- Archived projects remain readable but reject new paid/editorial/publication
  commands.
- Unknown public-site configuration blocks article publication later.
- Public-site code never reads private project descriptions.
- One `publicSiteId` can associate with at most one active editorial Project in
  R1 unless multi-workspace ownership is deliberately introduced later.
- All source-controlled site configs implement the same contract, but each can
  enable landing, blog, localization, and legal surfaces independently while
  incomplete legacy products are being upgraded.

## Final demonstration

Resolve all four initial public-site configurations. Create real Projects for at
least SubIQ and one additional product from the admin UI, refresh, reopen them,
and prove each displays its own domain, locales, brand, and capabilities.
