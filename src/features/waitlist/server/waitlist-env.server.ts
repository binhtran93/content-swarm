import "server-only";

import { z } from "zod";

const waitlistEnvSchema = z.object({
  TURNSTILE_SECRET_KEY: z.string().min(1),
  WAITLIST_EMAIL_HASH_SECRET: z.string().min(32),
});

export function getWaitlistServerEnv() {
  const result = waitlistEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      "Waitlist is unavailable because its server configuration is incomplete.",
    );
  }
  return result.data;
}
