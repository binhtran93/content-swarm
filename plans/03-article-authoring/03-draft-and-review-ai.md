# 03.03 — Draft and Review AI

Status: Not started

## Outcome

The Article contains owner-saved, validated Review MDX that can become public
after metadata completion. Unsafe generated or manual MDX cannot pass blocking
validation.

## Depends on

- [Brief and Outline AI](./02-brief-and-outline-ai.md)

## Firestore ownership

No new collection. This feature updates:

```text
draft.mdx + draft.hash
review.mdx + review.hash
currentStep
editorialStatus
revision
updatedAt
```

Draft and Review are separate complete sources. Review is not a patch/report.
Copying Draft into the Review editor does not persist until Save.

## MDX contract

Allowed:

- Markdown paragraphs, H2–H4, emphasis, safe links/images, code, lists,
  blockquotes, and GFM tables.
- `Callout`, `Steps`, `Tabs`, `Tabs.Tab`, `Bleed`, `Cards`, `Cards.Card` with
  documented literal props.

Blocking:

- H1, frontmatter, imports, exports, raw HTML, scripts.
- Unknown JSX components.
- Event handlers, spread properties, identifiers, function calls, or arbitrary
  expressions.
- Unsafe protocols and images without meaningful alt text.

Title stays outside MDX. Validation must parse source; regex alone is not an
adequate security boundary.

## Commands

- `validateArticleMdx(source, title)`.
- `saveDraft(..., expectedRevision)`.
- `generateDraft(projectId, articleId)`.
- `saveReview(..., expectedRevision)`.
- `generateReview(projectId, articleId)`.

## Backoffice behavior

- Source editor and inert/safe preview.
- Desktop side-by-side where useful; mobile Source/Preview switch.
- Blocking errors and editorial warnings are visually distinct.
- Save blocked by safety/structure errors.
- Review can start by copying saved Draft without AI.
- AI failure/invalid MDX preserves current editor.

## AI behavior

### Draft

Version: `article-draft-v1`

Canonical source:
[Draft prompt](../../src/features/articles/prompts/article-draft-prompt.ts)

Server inputs:

- Project context and source locale.
- Keyword snapshot.
- Saved Brief/hash.
- Saved Outline/hash and title.
- Writing rules.
- Approved MDX component contract.
- Owner-supplied/approved URL allowlist.

Required system prompt:

```text
Write one complete helpful article body as publication-ready MDX. Follow the
saved brief and outline. The page renders the title, so do not add an H1 or
repeat the title as an opening line. Begin sections at H2. Use keywords
naturally and only where useful. Use only approved MDX components with literal
approved props. Do not add frontmatter, imports, exports, raw HTML, scripts,
handlers, JavaScript expressions, unapproved URLs, invented facts, quotations,
statistics, or first-hand experience. Return only MDX with no code fence or
explanation.
```

### Review

Version: `article-review-v1`

Canonical source:
[Review prompt](../../src/features/articles/prompts/article-review-prompt.ts)

Server inputs add saved Draft/hash.

Required system prompt:

```text
Return a complete revised MDX article, not a review report or patch. Improve
clarity, accuracy of expression, flow, natural search-intent coverage, and MDX
structure while preserving the article's supported meaning. Ensure it satisfies
the saved brief and outline. Apply the same MDX and URL restrictions as Draft.
Do not invent or verify facts using unstated knowledge. Return only complete MDX.
```

Generated output must pass the server validator before it is offered to the
editor.

## Public behavior

None yet. The preview uses the public component contract, but public routes do
not read Draft or Review.

## Planned implementation links

- [MDX policy](../../src/features/articles/config/mdx-policy.ts)
- [MDX validator](../../src/features/articles/service/validate-article-mdx.ts)
- [Draft prompt](../../src/features/articles/prompts/article-draft-prompt.ts)
- [Review prompt](../../src/features/articles/prompts/article-review-prompt.ts)
- [MDX generation](../../src/features/articles/service/generate-article-mdx.server.ts)
- [MDX workspace](../../src/features/articles/components/mdx-workspace.tsx)
- [Validator fixtures](../../src/features/articles/service/validate-article-mdx.test.ts)

## Implementation order

1. Adapt one AST-based MDX validation/component contract from the legacy apps.
2. Build shared safe preview adapters.
3. Implement manual Draft validate/save.
4. Implement Draft prompt/generation with generated-output validation.
5. Implement copy-to-Review and manual Review save.
6. Implement Review prompt/generation.
7. Test all allowed components and representative hostile input.
8. Test manual-only, AI-disabled, timeout, invalid output, and stale revision.

## Tangible output

A real Article containing `review.mdx` and `review.hash`, validated by the same
policy intended for the public renderer.

## Verification

- Manual-only Draft and Review work with AI disabled.
- Generated output is never saved automatically.
- Unsafe content neither previews executably nor saves.
- TOC heading slugs match rendered heading IDs.
- Title is one H1 outside MDX.
- Review remains unchanged if Draft later changes; the UI at minimum warns that
  Review may need attention, even if full dependency hashes are deferred.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- A real Article has valid saved Review MDX.
- Public renderer compatibility fixtures pass.
- The owner can complete the entire writing path without AI.

