# ADR 0001: Platform runtime

Status: Accepted

The application lives in this repository and uses npm 11 on Node.js 24. It uses
Next.js 16 and React 19.

The application serves public and admin routes with strict server boundaries.
Automated Firebase integration tests use local emulators with isolated Project
IDs; production uses explicit Firebase Admin credentials. Dedicated public-site
deployments select one Project through deployment configuration while the
central ANMISOFT Firebase project remains the website backend.
