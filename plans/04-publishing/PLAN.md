# Publishing — Overall Plan

Status: Not started

## Boundary decision

Publishing is an implementation stage of the `articles` code feature, not a
separate top-level feature. Its models and services live under
`src/features/articles/publishing`, and its backoffice controls live under
`src/features/articles/backoffice/publishing`.

Editable article records and public snapshots remain separate in Firestore.
That separation protects the public site from draft changes and keeps publish,
republish, and archive operations explicit.

## Goal

Convert a validated working Article into sanitized public Firestore documents
through an explicit, atomic operation. Working edits after publication must not
change the live result.

## User journey

```text
Ready Article
→ Open Publish Preview
→ Select approved locales
→ Review exact URLs and candidate data
→ Confirm Publish or Republish
→ Public documents become available
→ Continue editing working Article without changing them
→ Republish later or Archive explicitly
```

## Ownership

Publishing owns:

- `publicArticles/{articleId--locale}` sanitized public projections.
- `publicSlugs/{locale--slug}` public resolution records.
- Candidate snapshot construction.
- Publish, republish, locale addition, and archive transactions.
- Publication audit events and public invalidation notification.

Publishing reads Article Authoring only through a publication-candidate
contract. Public Experience reads Publishing through a read-only public content
service.

Every publication document, slug, candidate, transaction, and invalidation key
is scoped to one explicit `projectId`. A slug or Article ID from one Project can
never resolve or overwrite data in another Project.

## Data flow

Inputs:

- Expected working Article revision.
- Complete source publication candidate.
- Explicitly selected approved current translations.
- Authenticated actor confirmation.

Outputs:

- Sanitized source and locale public documents.
- Stable public slug mappings.
- Updated Article publication summary.
- Audit event and invalidation signal.

## Implementation sequence

1. [Public Snapshot](./01-public-snapshot.md)
2. [Publish, Republish, and Archive](./02-publish-republish-archive.md)

## Shared rules

- Preview and confirmation use the same candidate builder.
- Confirmation includes an expected Article revision/hash.
- Publish revalidates everything on the server.
- Public writes are atomic; failure leaves the previous public version intact.
- First publish sets `publishedAt`.
- Republish preserves `publishedAt` and updates `contentUpdatedAt`.
- Saving working Article data never calls Publishing.
- Only approved current translations can be selected.
- Archive removes normal public resolution but retains sanitized snapshot/audit.

## Final demonstration

Publish the real Ready SubIQ Article and selected approved translation. Open the
public documents directly through the read service. Edit/save the working Review
and prove public content remains unchanged. Republish and observe the update.
Archive and prove the public slug no longer resolves.

Repeat a minimal source publication for a second configured Project before
declaring multi-project Publishing complete, proving identical slugs can exist
independently across Projects.
