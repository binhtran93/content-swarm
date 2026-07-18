# 02.02 — Keyword Grouping AI

Status: Not started

## Outcome

The owner can request an AI grouping proposal, inspect or edit it, and apply
only confirmed compatible groups. The persisted output is the same Keyword
Group contract created manually.

## Depends on

- [Keyword Backlog](./01-keyword-backlog.md)

## Firestore ownership

No new product collection. This feature reads eligible Keyword summaries and
writes Keyword Groups only through the Backlog grouping command.

An audit event records request outcome and applied group count. Do not store the
complete prompt/response unless a later diagnostic requirement justifies it.

## AI behavior

Trigger: explicit `Analyze grouping` action.

Inputs assembled on the server:

- Project name and description.
- Selected or filtered eligible keywords.
- Keyword ID, text, surface, market, and relevant metrics.
- Current group membership exclusions.

Output schema:

```ts
type KeywordGroupingProposal = {
  groups: Array<{
    suggestedName: string | null
    primaryKeywordId: string
    memberKeywordIds: string[]
    rationale: string
  }>
  ungroupedKeywordIds: string[]
}
```

AI output is an unsaved proposal. The server validates IDs, compatibility,
membership, group size, and duplicates. Applying re-reads current keywords in a
transaction so a stale proposal cannot corrupt grouping.

## Prompt contract

Version: `keyword-grouping-v1`

Planned canonical source:
[Grouping prompt](../../src/features/keywords/prompts/keyword-grouping-prompt.ts)

Required system prompt:

```text
You organize accepted search keywords into article topics. Group only keywords
that can be satisfied naturally by one useful article with the same search
intent. Never combine different surfaces or markets. Choose the clearest broad
keyword as primary. It is valid to leave keywords ungrouped. Use only supplied
IDs and return only the requested structured object. Do not invent keywords.
```

User prompt sections:

```text
<project-context>...</project-context>
<grouping-rules>...</grouping-rules>
<keywords-json>...</keywords-json>
```

Tests must cover overlapping cancellation terms, clearly unrelated terms,
mixed-market protection, invented IDs, and empty/single-keyword inputs.

## Backoffice behavior

- Owner selects eligible keywords or chooses Analyze visible keywords.
- Button shows explicit generating state and never runs on page load/filter.
- Proposal shows groups, primary/member selection, rationale, and ungrouped rows.
- Owner may remove groups/members or choose another compatible primary.
- `Apply selected groups` revalidates and persists.
- Provider or validation failure changes no Keyword/Group document.

## Public behavior

None.

## Planned implementation links

- [Prompt](../../src/features/keywords/prompts/keyword-grouping-prompt.ts)
- [Output schema](../../src/features/keywords/model/keyword-grouping-proposal.ts)
- [AI command](../../src/features/keywords/service/propose-keyword-groups.server.ts)
- [Apply command](../../src/features/keywords/service/apply-keyword-group-proposal.server.ts)
- [Proposal UI](../../src/backoffice/features/keywords/keyword-grouping-proposal.tsx)
- [Prompt tests](../../src/features/keywords/prompts/keyword-grouping-prompt.test.ts)

## Implementation order

1. Add the first real shared AI provider boundary with disabled/test mode.
2. Implement versioned prompt and structured output schema.
3. Implement server proposal command.
4. Implement proposal review UI.
5. Implement transactional apply through Keyword Group ownership.
6. Add prompt fixtures, invalid-output, stale-data, and no-mutation tests.

## Tangible output

At least one owner-confirmed Keyword Group persisted from an AI proposal, with
the proposal itself remaining non-authoritative and unsaved.

## Verification

- AI disabled/provider failure leaves Backlog unchanged.
- Invented, duplicate, incompatible, or already-grouped IDs are rejected.
- Owner edits are applied only after confirmation.
- Prompt version appears in request diagnostics/audit details.
- Normal automated tests make no real AI network call.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- AI grouping can be demonstrated on real SubIQ Backlog data.
- Manual grouping remains fully usable with AI disabled.
- Only confirmed groups persist.
