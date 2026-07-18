# Keyword Research — Overall Plan

Status: Not started

## Boundary decision

Keyword Backlog, manual grouping, and provider-backed discovery are one
top-level code feature: `keywords`. They share vocabulary, normalization,
permissions, and backoffice workflows.

Their Firestore records remain separate because they have different lifecycles:

- `keywords` contains accepted, editable, actionable work.
- `keywordGroups` contains reviewed grouping decisions.
- `keywordDiscoveries` contains immutable provider-run history and its bounded
  ordered result array. Accepting a result creates a keyword; it does not mutate
  the discovery record.

## Goal

Give the owner a real, reusable topic Backlog before any article is created.
Manual entry and grouping must work without external providers. Paid discovery
remains an explicit optional tool.

## User journey

```text
Active Project
→ Add known keywords manually or run an explicit discovery
→ Accept selected results into Backlog
→ Organize compatible keywords into article topics
→ Make unassigned individual/grouped topics available to Article Creation
```

## Ownership

Keyword Research owns:

- `keywords`, `keywordGroups`, and `keywordDiscoveries`.
- Web keyword country/language validation.
- Keyword uniqueness, metrics, source discovery, grouping, and Article assignment.
- DataForSEO operations and cost-control behavior.

Article Creation stores one primary `keywordId` and resolves its optional Group
through Keyword-owned queries. Assigned Group membership is immutable.

## Data flow

Inputs:

- Active Project.
- Manual keyword text or a web discovery request.
- Owner grouping/acceptance decisions.

Outputs:

- Accepted individual Backlog topics.
- Accepted grouped topics with one lead and supporting keywords.
- Immutable reusable Discovery records.
- `listAvailableArticleTopics(projectId)` contract for Article Creation.

## Implementation sequence

1. [Keyword Backlog](./01-keyword-backlog.md)
2. [Keyword Discovery](./02-keyword-discovery.md)

Manual Backlog comes first so Article Creation never depends on paid discovery.

## Shared rules

- Keyword identity is unique by Project, normalized keyword, country, and
  language. The identity is used internally for the document ID and is not
  stored as another field.
- All R1 keywords target web search; there is no surface field.
- Groups contain one country and language only.
- A keyword belongs to at most one active group.
- Discovery results never enter Backlog automatically.
- Successful discoveries are immutable, including empty results.
- Provider calls happen only after an explicit owner request.
- Article Creation assigns selected keywords to its new Article. Publishing
  does not change Keyword documents.

## Final demonstration

For the real SubIQ project:

1. Add manual keywords.
2. Group compatible keywords manually.
3. Run or reopen one saved discovery.
4. Accept selected results.
5. Show the available-topic query returning real individual/grouped choices.
