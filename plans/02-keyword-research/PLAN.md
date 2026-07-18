# Keyword Research — Overall Plan

Status: Not started

## Boundary decision

Keyword Backlog, AI grouping, and provider-backed discovery are one top-level
code feature: `keywords`. They share vocabulary, normalization,
permissions, and backoffice workflows.

Their Firestore records remain separate because they have different lifecycles:

- `keywords` contains accepted, editable, actionable work.
- `keywordGroups` contains reviewed grouping decisions.
- `keywordDiscoveries` and its `candidates` contain immutable provider-run
  history and provenance. Accepting a candidate creates or updates a keyword;
  it does not mutate the discovery record.

## Goal

Give the owner a real, reusable topic Backlog before any article is created.
Manual entry must work without external providers. Paid discovery and AI
grouping remain explicit optional tools.

## User journey

```text
Active Project
→ Add known keywords manually or run an explicit discovery
→ Accept selected candidates into Backlog
→ Organize compatible keywords into article topics
→ Make unused individual/grouped topics available to Article Creation
```

## Ownership

Keyword Research owns:

- `keywords`, `keywordGroups`, `keywordDiscoveries`, and discovery `candidates`.
- Search-market catalogue validation.
- Keyword identity, metrics, provenance, grouping, and used state.
- DataForSEO operations and cost-control behavior.
- Optional AI grouping proposals.

It does not own article keyword data. Article Creation copies an immutable
keyword snapshot through a Keyword query contract.

## Data flow

Inputs:

- Active Project.
- Manual keyword text or provider origin/market.
- Owner grouping/acceptance decisions.

Outputs:

- Accepted individual Backlog topics.
- Accepted grouped topics with one lead and supporting keywords.
- Immutable reusable Discovery records.
- `listAvailableArticleTopics(projectId)` contract for Article Creation.

## Implementation sequence

1. [Keyword Backlog](./01-keyword-backlog.md)
2. [Keyword Grouping AI](./02-keyword-grouping-ai.md)
3. [Keyword Discovery](./03-keyword-discovery.md)

Manual Backlog comes first so Article Creation never depends on paid discovery.

## Shared rules

- Keyword identity is unique by project, normalized keyword, surface, and
  market.
- Target market and discovery origin are different concepts.
- Groups contain one surface and market only.
- A keyword belongs to at most one active group.
- AI proposes grouping but never applies it.
- Discovery results never enter Backlog automatically.
- Successful discoveries are immutable, including empty results.
- Provider calls happen only after an explicit owner request.
- First successful article publication marks snapshotted keywords Used.

## Final demonstration

For the real SubIQ project:

1. Add manual keywords.
2. Group compatible keywords with or without the AI proposal.
3. Run or reopen one saved discovery.
4. Accept selected candidates.
5. Show the available-topic query returning real individual/grouped choices.
