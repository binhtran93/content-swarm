import "server-only";

import { createHmac } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";

import { readPublicProjectAcquisition } from "@/features/projects/public/get-public-project-acquisition.server";
import {
  type JoinWaitlistResult,
  waitlistSignupInputSchema,
} from "@/features/waitlist/model/waitlist-signup";
import { getWaitlistServerEnv } from "@/features/waitlist/server/waitlist-env.server";
import { verifyTurnstile } from "@/features/waitlist/server/verify-turnstile.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

export async function joinWaitlist(
  input: unknown,
): Promise<JoinWaitlistResult> {
  const result = waitlistSignupInputSchema.safeParse(input);
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0]?.message ?? "Check your email address.",
    };
  }
  const value = result.data;
  if (value.website) return { ok: true };

  const acquisition = await readPublicProjectAcquisition(value.projectId);
  if (acquisition.mode !== "waitlist") {
    return { ok: false, error: "The waitlist is no longer accepting signups." };
  }

  const environment = getWaitlistServerEnv();
  if (
    !(await verifyTurnstile(
      value.turnstileToken,
      environment.TURNSTILE_SECRET_KEY,
    ))
  ) {
    return {
      ok: false,
      error: "The security check expired or failed. Please try again.",
    };
  }

  const documentId = createHmac(
    "sha256",
    environment.WAITLIST_EMAIL_HASH_SECRET,
  )
    .update(`${value.projectId}\0${value.email}`)
    .digest("hex");
  const reference = getServerFirestore()
    .collection("projects")
    .doc(value.projectId)
    .collection("waitlistSignups")
    .doc(documentId);

  await getServerFirestore().runTransaction(async (transaction) => {
    if ((await transaction.get(reference)).exists) return;
    const now = Timestamp.now();
    transaction.create(reference, {
      schemaVersion: 1,
      email: value.email,
      locale: value.locale,
      source: value.source,
      consentedAt: now,
      createdAt: now,
    });
  });
  return { ok: true };
}
