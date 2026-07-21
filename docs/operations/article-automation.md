# Article publishing automation

Article automation is opt-in for each active Project. It publishes at most one
source Article per scheduled day and does not create Translations.

The source keyword is used as the Article title. The slug is derived locally
from that title, topics remain empty, the SEO title matches the Article title,
and the generated excerpt is also used as the SEO description. These defaults
do not require an additional AI metadata request.

## Deployment

1. Deploy the application and the Firestore indexes before enabling a Project.
2. Create a dedicated Google service account that can mint an OIDC token. It
   does not need Firebase Admin credentials or browser access.
3. Set `ARTICLE_AUTOMATION_OIDC_AUDIENCE` to the exact public URL of
   `/api/automation/articles/run` and set
   `ARTICLE_AUTOMATION_SERVICE_ACCOUNT` to that service account's email.
4. Create a Cloud Scheduler HTTP job with the cron expression `*/15 * * * *`,
   method `POST`, the same endpoint URL, and an OIDC token whose audience is the
   configured audience.
5. In Project settings, choose the local time and IANA timezone, then enable
   daily article publishing.

The Articles page also provides **Run automation** beside **New article**. This
owner-authenticated action runs the same leased pipeline immediately, even when
the daily schedule is disabled. If daily automation is enabled, a successful
manual run advances the next scheduled run to the following day.

The endpoint accepts no Project identifiers. It discovers only enabled, due
Project configuration documents and verifies both the token audience and
service-account email.

## Failure and recovery

AI/provider operations retry three times. A run that still fails retains its
assigned draft and completed stage; the next scheduled day resumes that draft
before selecting another keyword. The backoffice displays a sanitized error.
MDX and publication-readiness validation are never bypassed.

Disable automation in Project settings to stop future runs. An already-running
request may finish its current bounded operation, but the next due lookup will
not select the disabled Project.
