import "server-only";

import { z } from "zod";

const responseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
});

export async function verifyTurnstile(
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) return false;
    const result = responseSchema.safeParse(await response.json());
    return (
      result.success &&
      result.data.success &&
      result.data.action === "waitlist_signup"
    );
  } catch {
    return false;
  }
}
