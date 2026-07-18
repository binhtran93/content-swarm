# ADR 0001: Platform runtime

Status: Accepted

The application lives in this repository and uses npm. It supports Node.js
20.9 or newer and aligns on Next.js 16 and React 19, matching the maintained
legacy applications while adapting the Nexus 15 presentation patterns.

The first deployment serves public and admin routes from one application with
strict server boundaries. Automated Firebase integration tests use local Auth
and Firestore emulators with isolated project IDs; production uses an explicit
Firebase Admin service account.
