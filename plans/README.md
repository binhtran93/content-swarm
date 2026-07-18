# ANMISOFT Content Platform — Build Plans

This directory is the execution source of truth for rebuilding `tdbinh` and
`seo-pipe-lite` as one maintainable product.

It is written for one owner working with AI. There are no epics, ceremonies, or
calendar estimates. Work one file at a time, in order. Do not begin the next
file until the current file produces its stated output and passes verification.

## Working rule

For each implementation file:

1. Read its parent `PLAN.md` first.
2. Inspect the referenced legacy code; adapt behavior, not folder structure.
3. Implement its Firestore contract and server boundary.
4. Implement the backoffice behavior that creates real data.
5. Implement its AI behavior and prompt when applicable.
6. Verify the tangible output in Firestore and the UI.
7. Run formatting, lint, type checking, tests, and production build.
8. Update the implementation links if paths changed.
9. Mark the file complete only when every Done condition passes.

## Execution order

| Order | Plan | Tangible final output |
| --- | --- | --- |
| 00 | [Platform foundation](./00-platform-foundation.md) | Buildable app, test harness, Firebase boundary, and emulator/staging connection |
| 01 | [Projects](./01-projects/PLAN.md) | Real active product workspaces with minimal publication URL settings |
| 02 | [Keyword research](./02-keyword-research/PLAN.md) | Real accepted individual/grouped Backlog topics with reusable discoveries |
| 03 | [Article authoring](./03-article-authoring/PLAN.md) | A valid Ready working article and optional approved translations |
| 04 | [Publishing](./04-publishing/PLAN.md) | Sanitized public Firestore documents created by explicit publication |
| 05 | [Public experience](./05-public-experience/PLAN.md) | Public sites/blogs rendering real published data, followed by production cutover |

## Firestore ownership map

Each feature owns its documents, schemas, indexes, migrations, commands, and
tests. Other features must use its application contract instead of accessing
its Firestore documents directly.

| Owner | Paths |
| --- | --- |
| Projects | `projects/{projectId}` including optional `canonicalBaseUrl` |
| Keyword Research / Backlog | `projects/{projectId}/keywords/{keywordId}` and `keywordGroups/{groupId}` |
| Keyword Research / Discovery | `projects/{projectId}/keywordDiscoveries/{discoveryId}` with a bounded candidate array |
| Articles / Authoring | `projects/{projectId}/articles/{articleId}`, `translations/{locale}`, and `articleSlugs/{locale--slug}` |
| Articles / Publishing | `projects/{projectId}/publicArticles/{articleId--locale}` and `publicSlugs/{locale--slug}` |
| Platform audit | `projects/{projectId}/auditEvents/{eventId}`; features append through the shared audit contract |
| Public Experience | Read-only access to `publicArticles` and `publicSlugs`; owns no editorial data |

## Cross-feature rules

- Firestore documents are persistence shapes, not UI view models.
- Every persisted document has `schemaVersion`, `createdAt`, and `updatedAt`
  where mutation is allowed.
- Firestore timestamps are stored as Firestore `Timestamp`, not ISO strings.
- Server services translate timestamps into serializable application models.
- Public code never reads `articles`, translations, prompts, discoveries, or
  other editorial documents.
- Article creation snapshots keywords so later Backlog changes do not rewrite
  historical writing inputs.
- Working articles and public articles are different documents.
- Saving working content never updates a public document.
- AI generates an unsaved proposal. It never saves, approves, advances, or
  publishes.
- Paid provider calls occur only after an explicit owner command.
- A feature is incomplete until its output is visible, persisted, and usable by
  the next feature.
- Every public query, slug, route, cache key, sitemap, and publication command is
  scoped by `projectId`; content from one Project must never appear on another
  Project’s domain.

## Multi-project public sites

The platform supports multiple public products from one codebase. Initial
configured project IDs are:

```text
subiq
jewelry-identifier
skylens
urge-zero
```

SubIQ is the first complete reference implementation, not a hard-coded product
inside shared services. Each Project stores only its optional canonical base
URL for publication. Landing structure, content, theme, header, footer,
navigation, assets, and other presentation choices belong to that site's code.
Sites may reuse shared public components without sharing an exact page
structure.

## Backoffice UI source: Nexus

The private backoffice uses the locally purchased Nexus template at
`/Users/binhtran/projects/AnmiSoft/nexus` as its UI foundation.

Adoption rules:

- Nexus is a licensed local source/reference directory and remains excluded from
  the production repository by `/nexus` in `.gitignore`.
- Copy and adapt only the components/styles needed by the product into owned
  code under `src/backoffice/`.
- Never import production code directly from `../nexus`, use symlinks, or make
  the build depend on the local template directory.
- The copied code becomes maintained product code and must follow the target
  Next.js, React, TypeScript, accessibility, testing, and formatting rules.
- Use Nexus/DaisyUI for the backoffice presentation. Do not carry Ant Design UI
  from `seo-pipe-lite` into the new backoffice.
- Reuse `seo-pipe-lite` business behavior and server contracts selectively, not
  its visual component implementation.
- Public product/blog UI remains based on the best `tdbinh` public components
  and does not depend on the Nexus admin shell.
- Do not copy Nexus demo dashboards, ecommerce/chat/file-manager apps, charts,
  fake data, placeholder account actions, or unused dependencies.
- Preserve a short provenance/license notice for adapted Nexus files. Confirm
  that the purchased Solo/Team/Enterprise package covers this one end product
  and everyone who receives source access.

The detailed adoption boundary is in
[Platform Foundation](./00-platform-foundation.md#nexus-backoffice-adoption).

Presentation code is surface-owned:

```text
src/features/{domain}/        Vertical slice: model, services, prompts/providers, and backoffice UI
src/backoffice/               Shared Nexus/DaisyUI shell, UI primitives, config, and styles only
src/public-site/              Shared public components plus independent project sites
```

Shared public components may consume the minimal CSS variables defined in
`src/public-site/styles/theme-contract.css`. Each site owns scoped overrides in
its own `theme.css`; the contract does not control its content or layout.

Backoffice-specific UI must stay inside each feature's `backoffice/` folder;
surface-neutral models and services must not import it. Backoffice and public
components may share headless logic or schemas, but they should not share
cards, forms, tables, shells, or styling by default.

## Prompt ownership

The implementation plan defines the prompt contract. During implementation, the
exact production prompt moves into the linked feature prompt file, which then
becomes the canonical source. The plan retains purpose, inputs, output schema,
constraints, version, and verification examples.

Prompt versions use stable IDs such as `article-brief-v1`. Changing behavior
requires a new version and prompt tests.

## Implementation links

Each feature file links to its intended source, prompt, component, and test
paths. Before the application is scaffolded these are planned targets and may
not exist yet. Once implementation starts, keep the links accurate; if a path
changes, update the owning plan in the same change.

## Completion status

Use these markers at the top of each implementation file:

```text
Status: Not started | In progress | Complete | Blocked
```

Do not mark Complete based only on code creation. Complete means its real output
exists and all verification commands pass.

## Source of truth

Treat `plans/` as authoritative for implementation order, Firestore ownership,
feature outputs, and prompt contracts. When implementation changes an approved
contract, update its owning plan in the same change.
