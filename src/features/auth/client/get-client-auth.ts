"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";

let emulatorConnected = false;

export function getClientAuth(): Auth {
  const firebaseApp =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
  const auth = getAuth(firebaseApp);
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

  if (emulatorHost && !emulatorConnected) {
    connectAuthEmulator(auth, `http://${emulatorHost}`, {
      disableWarnings: true,
    });
    emulatorConnected = true;
  }

  return auth;
}
