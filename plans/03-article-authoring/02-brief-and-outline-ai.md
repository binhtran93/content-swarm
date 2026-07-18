# 03.02 — Brief and Outline AI

Status: Not started

## Outcome

The Article has a saved writing Brief, Outline, and structured proposed title.
Both steps work manually; AI only proposes unsaved editor content.

## Depends on

- [Article Creation](./01-article-creation.md)

## Firestore ownership

No new collection. This feature updates these Article fields:

```text
brief
outline
title
updatedAt
```

Brief and Outline are plain Markdown strings. Save only the field being edited;
do not replace the complete Article document.

## Commands

- `saveBrief(projectId, articleId, brief)`.
- `generateBrief(projectId, articleId)`.
- `saveOutline(projectId, articleId, outline, title)`.
- `generateOutline(projectId, articleId)`.

Generation reads authoritative saved Article dependencies on the server.

## Backoffice behavior

- Workspace stepper with Brief and Outline sections.
- One canonical Markdown text editor per step.
- Explicit Generate and Save buttons with separate states.
- Generated proposal is unsaved and can be edited/discarded.
- Confirm before replacing owner-modified unsaved text.
- Outline title is a separate required field or reliably parsed into one
  structured field; do not leave the only title inside Markdown.
- Outline cannot save before Brief; Content cannot open before Outline/title.

## AI behavior

### Brief

Version: `article-brief-v1`

Canonical source:
[Brief prompt](../../src/features/articles/prompts/article-brief-prompt.ts)

Server inputs:

- Project name and description.
- Current selected Keyword and optional Keyword Group resolved from
  `Article.keywordId`.
- Source locale.
- Versioned general writing rules.

Required system prompt:

```text
You create a concise editorial brief for one helpful article. Treat keywords as
reader-intent signals, not phrases that must all be repeated. Define the reader,
goal, search intent, required coverage, boundaries, tone, and useful outcome.
Do not write article prose, invent facts, or include SEO filler. Return only
Markdown for the brief.
```

### Outline

Version: `article-outline-v1`

Canonical source:
[Outline prompt](../../src/features/articles/prompts/article-outline-prompt.ts)

Server inputs:

- Project context.
- Current selected Keyword and optional Keyword Group.
- Saved Brief.
- Source locale.
- Writing rules and approved MDX component descriptions.

Required system prompt:

```text
You create a structured article outline from the saved brief. Return one clear
proposed title, introduction intent, H2 sections, optional H3 sections, and key
points. Suggest an approved semantic MDX component only when it improves the
explanation. Do not write full article prose, invent facts, add an H1, or depart
from the brief. Return only the requested structured result.
```

Outline AI output should be structured:

```ts
{ title: string; outlineMarkdown: string }
```

## Public behavior

None. Brief, Outline, and proposed Title remain editorial.

## Planned implementation links

- [Brief prompt](../../src/features/articles/prompts/article-brief-prompt.ts)
- [Outline prompt](../../src/features/articles/prompts/article-outline-prompt.ts)
- [Writing rules](../../src/features/articles/config/writing-rules.ts)
- [Generate Brief](../../src/features/articles/service/generate-article-brief.server.ts)
- [Save Brief](../../src/features/articles/service/save-article-brief.server.ts)
- [Generate Outline](../../src/features/articles/service/generate-article-outline.server.ts)
- [Save Outline](../../src/features/articles/service/save-article-outline.server.ts)
- [Writing editor](../../src/features/articles/backoffice/writing-step-editor.tsx)
- [Prompt tests](../../src/features/articles/prompts/article-writing-prompts.test.ts)

## Implementation order

1. Implement the single-field Brief and Outline save commands.
2. Implement manual Brief editor/save and prerequisites.
3. Add versioned Brief prompt and generation command.
4. Implement Outline/title manual editor/save.
5. Add structured Outline prompt and generation command.
6. Add unsaved replacement confirmation and failure preservation.
7. Test manual-only, provider-disabled, invalid output, concurrency, and refresh.

## Tangible output

A real Article with persisted:

```text
brief
outline
title
```

Content generation can now run entirely from saved data.

## Verification

- Manual-only completion works with AI disabled.
- Generate creates no Firestore write.
- Refresh before Save restores previous saved value, not the proposal.
- Outline generation cannot use unsaved browser Brief text.
- Normal tests make no real AI call.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- A real Article has a saved Brief, Outline, and title.
- Manual and AI-assisted paths are demonstrated.
- Content is unlocked only by saved prerequisites.
