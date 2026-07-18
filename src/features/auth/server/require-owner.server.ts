import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

import { ownerSessionConfig } from "@/features/auth/server/session-config.server";
import { getServerEnv } from "@/platform/env/server-env";
import { getAdminAuth } from "@/platform/firebase/admin-auth.server";

class OwnerSessionError extends Error {
  constructor() {
    super("Owner session required.");
    this.name = "OwnerSessionError";
  }
}

export async function requireOwner(): Promise<DecodedIdToken> {
  const sessionCookie = (await cookies()).get(
    ownerSessionConfig.cookieName,
  )?.value;
  if (!sessionCookie) throw new OwnerSessionError();

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    if (decoded.uid !== getServerEnv().FIREBASE_OWNER_UID) {
      throw new OwnerSessionError();
    }
    return decoded;
  } catch {
    throw new OwnerSessionError();
  }
}
