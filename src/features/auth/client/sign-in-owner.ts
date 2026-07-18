"use client";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { getClientAuth } from "@/features/auth/client/get-client-auth";
import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";

class OwnerSignInError extends Error {
  constructor() {
    super("Unable to sign in. Check your credentials and try again.");
    this.name = "OwnerSignInError";
  }
}

export async function signInOwner(
  email: string,
  password: string,
): Promise<void> {
  const auth = getClientAuth();

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (credential.user.uid !== DEPLOYED_OWNER_UID) {
      await signOut(auth);
      throw new OwnerSignInError();
    }

    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        idToken: await credential.user.getIdToken(true),
      }),
    });

    if (!response.ok) {
      await signOut(auth);
      throw new OwnerSignInError();
    }
  } catch (error) {
    if (auth.currentUser) await signOut(auth).catch(() => undefined);
    if (error instanceof OwnerSignInError) throw error;
    throw new OwnerSignInError();
  }
}
