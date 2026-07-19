# 03.02 — Article Plan AI

Status: In progress

## Outcome

The Article has one saved Article plan and a proposed title. The plan combines
editorial direction with article structure, works manually, and can be proposed
by grounded Gemini generation without auto-saving.

## Depends on

- [Article Creation](./01-article-creation.md)

## Firestore ownership

No new collection. This feature updates:

```text
plan
planReferences
title
updatedAt
```

`plan` is Markdown. `planReferences` contains the unique URL sources returned by
Gemini Google Search grounding for the saved proposal. Legacy `brief` and
`outline` fields are combined when old documents are read but are not written
for new Articles.

## Commands

- `saveArticlePlan(projectId, articleId, plan, title, references)`.
- `generateArticlePlan(projectId, articleId)`.

Generation reads authoritative Project, Keyword, and optional Keyword Group
context on the server.

## Backoffice behavior

- One Article plan step with a title input and WYSIWYG Markdown editor.
- Explicit Generate plan and Save plan actions with separate loading states.
- Generated content and sources remain unsaved until the owner saves.
- Confirm before replacing owner-modified unsaved content.
- Show saved or proposed grounding sources in a compact menu.
- Content remains locked until both the Article plan and title are saved.

## AI behavior

Version: `article-plan-v1`

Canonical source:
[Article plan prompt](../../src/features/articles/prompts/article-plan-prompt.ts)

Inputs:

- Project name and description.
- Primary Keyword and supporting grouped Keywords.
- Source locale.
- Versioned writing rules and approved MDX component descriptions.

The plan defines the reader, intent, goal, angle, required facts, boundaries,
tone, introduction intent, H2/H3 structure, and short section instructions. It
does not write article prose.

Google Search grounding is enabled for the call. The prompt directs Gemini to
verify current, product-specific, regulated, time-sensitive, and factual
requirements. Returned URL sources are displayed separately from the plan.

Structured output:

```ts
{ title: string; planMarkdown: string }
```

## Public behavior

None. Article plan, proposed title, and grounding references remain editorial.

## Implementation links

- [Article plan prompt](../../src/features/articles/prompts/article-plan-prompt.ts)
- [Generate Article plan](../../src/features/articles/service/generate-article-plan.server.ts)
- [Save Article plan](../../src/features/articles/service/save-article-plan.server.ts)
- [Article workspace](../../src/features/articles/backoffice/article-workspace.tsx)
- [Shared Gemini gateway](../../src/platform/ai/generate-ai.server.ts)

## Verification

- Manual completion works with AI disabled.
- Generate creates no Firestore write.
- Refresh before Save restores the saved plan and sources.
- Existing Brief and Outline data opens as one combined plan.
- Google Search sources are normalized, deduplicated, persisted on Save, and
  visible in the workspace.
- Content unlocks only after the plan and title are saved.
- Normal tests make no real AI call.
