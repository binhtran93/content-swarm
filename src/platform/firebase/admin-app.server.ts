import "server-only";

import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";

import { getServerEnv } from "@/platform/env/server-env";

export function getAdminApp(): App {
  if (getApps().length > 0) return getApp();

  const environment = getServerEnv();
  const usingEmulator = Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST,
  );

  return initializeApp({
    ...(usingEmulator
      ? {}
      : {
          credential: cert({
            projectId: environment.FIREBASE_PROJECT_ID,
            clientEmail: environment.FIREBASE_CLIENT_EMAIL,
            privateKey: environment.FIREBASE_PRIVATE_KEY,
          }),
        }),
    projectId: environment.FIREBASE_PROJECT_ID,
  });
}
