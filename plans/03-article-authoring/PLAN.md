# Article Authoring — Overall Plan

Status: Not started

## Goal

Turn one real unused Backlog topic into a validated, publication-ready working
article. Every writing step works manually; AI is an explicit proposal tool.

## User journey

```text
Choose Backlog topic
→ Create Article with keyword snapshot
→ Save Brief
→ Save Outline and title
→ Save Draft MDX
→ Save reviewed MDX
→ Complete SEO/media
→ Optionally prepare and approve translations
→ Article becomes Ready
```

The workspace is revisitable, not an irreversible wizard. Saved prerequisites
control progression; a query parameter never becomes workflow truth.

## Ownership

Article Authoring owns:

- `articles/{articleId}`.
- `articles/{articleId}/translations/{locale}`.
- `articleSlugs/{locale--slug}` working slug reservations.
- Immutable keyword snapshots.
- Brief, Outline, Draft, Review, SEO, computed data, and readiness.
- Writing and translation prompts.

It does not own public article documents. Publishing receives a ready working
article through a read-only candidate contract.

## Data flow

Inputs:

- Active Project and public-site context.
- One available individual/grouped Backlog topic.
- Owner content/metadata.
- Optional AI proposals.

Outputs:

- `getPublicationCandidate(projectId, articleId, revision)` returning a complete
  validated source revision and selected approved translations.
- An Article with editorial status `ready` but no public effect.

## Implementation sequence

1. [Article Creation](./01-article-creation.md)
2. [Brief and Outline AI](./02-brief-and-outline-ai.md)
3. [Draft and Review AI](./03-draft-and-review-ai.md)
4. [SEO and Media](./04-seo-and-media.md)
5. [Translations AI](./05-translations-ai.md)

## Shared rules

- Article is created only after one eligible topic is saved.
- Keyword inputs are snapshots, not live references used during generation.
- Generate changes only the active unsaved editor.
- Save never invokes AI.
- Title and metadata remain outside MDX.
- Reviewed MDX is body-only and begins at H2.
- The same MDX safety contract is used by editor validation and public renderer.
- Editorial Ready does not mean Published.
- Saving an already-published Article changes only working data.
- Translation approval is tied to a source revision/hash.

## Final demonstration

Using real SubIQ Backlog data, create one article and complete it manually to
Ready. Then demonstrate one AI proposal without auto-saving. Optionally create
and approve a Vietnamese translation. Confirm that no public document exists
until Publishing runs.

