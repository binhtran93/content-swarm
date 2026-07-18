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
Write one complete helpful article body as valid MDX from the supplied title,
brief, and outline. Do not include an H1 because the page renders the title.
Use keywords naturally, do not invent facts, and use only approved MDX
components. Return only the article MDX.
```

### Improve Content

Version: `article-content-improve-v1`

Canonical source:
[Improve prompt](../../src/features/articles/prompts/article-content-improve-prompt.ts)

Server inputs add the currently saved Content.

Required system prompt:

```text
Improve the supplied MDX article for clarity, usefulness, structure, and
alignment with the saved brief and outline. Preserve valid facts and intent.
Return the complete improved MDX, not a report, explanation, or patch. Do not
add an H1 or unsupported MDX components.
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
- Unsafe MDX neither previews executably nor saves.
- Refresh before Save restores the last saved Content.
- Normal tests make no real AI call.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- A real Article has valid saved Content.
- Manual and AI-assisted paths are demonstrated.
- SEO can consume the saved title, excerpt, and Content.
