import { z } from "zod";

import { supportedLocales } from "@/config/supported-locales";

const localeValues = supportedLocales.map((item) => item.locale) as [
  string,
  ...string[],
];

export const waitlistSourceSchema = z.enum(["header", "hero", "final", "blog"]);

export const waitlistSignupInputSchema = z.object({
  projectId: z.literal("subiq"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),
  locale: z.enum(localeValues),
  source: waitlistSourceSchema,
  turnstileToken: z.string().min(1, "Complete the security check."),
  website: z.string().max(200),
});

export type WaitlistSource = z.infer<typeof waitlistSourceSchema>;

export type JoinWaitlistResult = { ok: true } | { ok: false; error: string };
