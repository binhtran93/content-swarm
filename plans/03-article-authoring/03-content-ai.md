# 03.03 — Content and AI Assistance

Status: Not started

## Outcome

The Article has one saved, editable MDX `content` field. The owner may write it
manually, generate an unsaved proposal, or request an unsaved improvement of
the current content.

## Depends on

- [Brief and Outline AI](./02-brief-and-outline-ai.md)

## Firestore ownership

No new collection. This feature updates only:

```text
content
updatedAt
```

There is no Draft/Review split, hash, revision, stored editor step, or automatic
save of AI output.

## Commands

- `saveArticleContent(projectId, articleId, content)`.
- `generateArticleContent(projectId, articleId)`.
- `improveArticleContent(projectId, articleId)`.

Save validates MDX and updates only `content` and `updatedAt`. Generate and
Improve return proposals without writing Firestore.

## Backoffice behavior

- One MDX editor with safe, inert preview.
- Desktop may show editor and preview side by side; mobile may switch between
  them.
- Explicit Save, Generate Content, and Improve Content actions.
- AI proposals replace nothing until the owner reviews, optionally edits, and
  saves them.
- Confirm before replacing unsaved editor text with an AI proposal.
- Validation errors preserve editor content.

## AI behavior and prompts

### Generate Content

Version: `article-content-v1`

Canonical source:
[Content prompt](../../src/features/articles/prompts/article-content-prompt.ts)

Server inputs:

- Project name and description.
- Selected Keyword and optional Keyword Group resolved from `Article.keywordId`.
- Saved title, Brief, and Outline.
- Source locale and writing rules.
- Approved MDX component descriptions.

Required system prompt:

```text
Write one complete, genuinely useful article body as valid MDX from the supplied
title, brief, and outline.

Write in natural, idiomatic language for the requested locale. The result must
read as though it was written and edited by a fluent native professional. Avoid
awkward, translated, overly formal, robotic, or unnatural phrasing that a
native reader would not normally use.

Respect the reader's time. Begin with useful substance rather than a generic
introduction. Every section and paragraph must add distinct information,
explanation, guidance, or a concrete example. Remove filler, obvious
statements, empty transitions, unnecessary summaries, and repeated ideas. Do
not restate the title, brief, outline, or the same advice in different words.

Use keywords naturally only when they fit the meaning. Never repeat keywords
for SEO purposes or distort a sentence to include one.

Prefer clear, specific, actionable explanations over broad claims. Use examples
when they materially improve understanding, but do not invent facts,
statistics, quotes, product behavior, or unsupported details. If the supplied
context is insufficient for a factual claim, omit the claim.

Do not include an H1 because the page renders the title. Use only approved MDX
components. Return only the complete article MDX with no commentary.
```

### Improve Content

Version: `article-content-improve-v1`

Canonical source:
[Improve prompt](../../src/features/articles/prompts/article-content-improve-prompt.ts)

Server inputs add the currently saved Content.

Required system prompt:

```text
Rewrite the supplied MDX into a clearer, more useful, and more natural article
while preserving its valid facts, meaning, links, and intended outcome.

The result must read as though it was written and edited by a fluent native
professional for the requested locale. Replace awkward, translated, robotic,
overly formal, or unnatural phrasing with idiomatic language a native reader
would actually use.

Respect the reader's time. Remove filler, generic introductions, empty
conclusions, unnecessary transitions, obvious statements, repeated ideas, and
sections that provide no distinct value. Combine overlapping passages. Ensure
every remaining paragraph contributes useful information, explanation,
guidance, or a concrete supported example.

Improve structure and flow while staying aligned with the saved brief and
outline. Use keywords naturally and never repeat them merely for SEO. Do not add
facts, statistics, quotes, product behavior, or other details unsupported by
the saved context.

Return the complete improved MDX, not a review report, explanation, summary, or
patch. Do not add an H1 or unsupported MDX components.
```

## Public behavior

None. Public pages continue reading only published snapshots.

## Planned implementation links

- [MDX validator](../../src/features/articles/service/validate-article-mdx.ts)
- [Content prompt](../../src/features/articles/prompts/article-content-prompt.ts)
- [Improve prompt](../../src/features/articles/prompts/article-content-improve-prompt.ts)
- [Generate Content](../../src/features/articles/service/generate-article-content.server.ts)
- [Improve Content](../../src/features/articles/service/improve-article-content.server.ts)
- [Save Content](../../src/features/articles/service/save-article-content.server.ts)
- [Content editor](../../src/features/articles/backoffice/article-content-editor.tsx)
- [Prompt tests](../../src/features/articles/prompts/article-content-prompts.test.ts)
- [Validator tests](../../src/features/articles/service/validate-article-mdx.test.ts)

Each model, prompt, or service file has one public export.

## Implementation order

1. Implement the allowed MDX contract and validator.
2. Implement manual Content save and safe preview.
3. Implement the Content generation prompt and command.
4. Implement the improvement prompt and command.
5. Add proposal review/replacement behavior.
6. Test unsafe MDX, manual-only use, disabled AI, invalid output, and refresh.

## Tangible output

A real Article with one saved `content` string that passes the same MDX
validation Publishing will use.

## Verification

- Manual writing and save work with AI disabled.
- Generate and Improve do not write Firestore.
- Prompt contracts require native, idiomatic, non-repetitive, useful writing
  and prohibit unsupported factual additions.
- Unsafe MDX neither previews executably nor saves.
- Refresh before Save restores the last saved Content.
- Normal tests make no real AI call.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- A real Article has valid saved Content.
- Manual and AI-assisted paths are demonstrated.
- SEO can consume the saved title, excerpt, and Content.
