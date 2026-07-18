import "server-only";

import { cookies } from "next/headers";

import { ownerSessionConfig } from "@/features/auth/server/session-config.server";
import { getServerEnv } from "@/platform/env/server-env";
import { getAdminAuth } from "@/platform/firebase/admin-auth.server";

class OwnerSessionCreationError extends Error {
  constructor() {
    super("Unable to create owner session.");
    this.name = "OwnerSessionCreationError";
  }
}

export async function createOwnerSession(idToken: string): Promise<void> {
  if (!idToken) throw new OwnerSessionCreationError();

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);
    if (decoded.uid !== getServerEnv().FIREBASE_OWNER_UID) {
      throw new OwnerSessionCreationError();
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ownerSessionConfig.maxAgeSeconds * 1000,
    });
    (await cookies()).set(ownerSessionConfig.cookieName, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ownerSessionConfig.maxAgeSeconds,
    });
  } catch (error) {
    if (error instanceof OwnerSessionCreationError) throw error;
    throw new OwnerSessionCreationError();
  }
}
