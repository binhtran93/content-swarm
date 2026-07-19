"use server";

import type { JoinWaitlistResult } from "@/features/waitlist/model/waitlist-signup";
import { joinWaitlist } from "@/features/waitlist/server/join-waitlist.server";

export async function joinWaitlistAction(
  _previousState: JoinWaitlistResult | null,
  formData: FormData,
): Promise<JoinWaitlistResult> {
  try {
    return await joinWaitlist({
      projectId: String(formData.get("projectId") ?? ""),
      email: String(formData.get("email") ?? ""),
      locale: String(formData.get("locale") ?? ""),
      source: String(formData.get("source") ?? ""),
      turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
      website: String(formData.get("website") ?? ""),
    });
  } catch {
    return {
      ok: false,
      error: "The waitlist is unavailable right now. Please try again later.",
    };
  }
}
