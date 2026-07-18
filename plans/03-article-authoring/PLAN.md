# Article Authoring — Overall Plan

Status: Not started

## Goal

Turn one real unassigned Backlog topic into a validated, publication-ready
working article. Every writing step works manually; AI is an explicit proposal
tool.

## User journey

```text
Choose Backlog topic
→ Create Article with one primary keyword ID
→ Save Brief
→ Save Outline and title
→ Save Content MDX
→ Complete SEO
→ Optionally prepare and approve translations
→ Readiness validation allows Publish
```

The workspace is revisitable, not an irreversible wizard. The URL identifies
the open section and saved fields determine progress; navigation state is never
stored in Firestore.

## Ownership

Article Authoring owns:

- `articles/{articleId}`.
- `articles/{articleId}/translations/{locale}`.
- `articleSlugs/{locale--slug}` working slug reservations.
- One primary Keyword reference; Keyword Group remains the source of truth for
  supporting members.
- Brief, Outline, Content, and simple SEO fields.
- Writing and translation prompts.

Publishing does not create another Article. It validates this Article and
changes its existing `status`; the public site then reads the published Article
directly.

## Data flow

Inputs:

- Active Project.
- One available individual/grouped Backlog topic.
- Owner content/metadata.
- Optional AI proposals.

Outputs:

- A validated source Article and optional approved Translation documents that
  Publishing can read.

## Implementation sequence

1. [Article Creation](./01-article-creation.md)
2. [Brief and Outline AI](./02-brief-and-outline-ai.md)
3. [Content and AI Assistance](./03-content-ai.md)
4. [SEO](./04-seo.md)
5. [Translations AI](./05-translations-ai.md)

## Shared rules

- Article is created only after one eligible topic is saved.
- Article stores one `keywordId`; services resolve its immutable assigned Group
  when writing or generating.
- Generate changes only the active unsaved editor.
- Save never invokes AI.
- Title and metadata remain outside MDX.
- Content MDX is body-only and begins at H2.
- The same MDX safety contract is used by editor validation and public renderer.
- Readiness is derived from saved fields and is not another stored status.
- Saving an already-published Article changes the public result immediately.
- The backoffice clearly warns the owner while editing published content.
- Translations are optional per-locale subcollection documents.

## Final demonstration

Using real SubIQ Backlog data, create one Article and complete it until derived
readiness passes. Demonstrate one AI proposal without auto-saving. Optionally
create and approve a Vietnamese Translation. Confirm that the draft is
unavailable publicly until Publishing changes its status.
