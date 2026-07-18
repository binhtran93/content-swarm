import "server-only";

import { z } from "zod";

import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";

const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().trim().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_OWNER_UID: z.string().trim().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  environment: Record<string, string | undefined>,
): ServerEnv {
  const result = serverEnvSchema.safeParse(environment);

  if (!result.success) {
    const names = [
      ...new Set(
        result.error.issues
          .map((issue) => issue.path.join("."))
          .filter(Boolean),
      ),
    ].join(", ");
    throw new Error(`Invalid server configuration. Check: ${names}`);
  }

  if (result.data.FIREBASE_OWNER_UID !== DEPLOYED_OWNER_UID) {
    throw new Error("Invalid server configuration. Check: FIREBASE_OWNER_UID");
  }

  return {
    ...result.data,
    FIREBASE_PRIVATE_KEY: result.data.FIREBASE_PRIVATE_KEY.replace(
      /\\n/g,
      "\n",
    ),
  };
}

let cachedEnvironment: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedEnvironment ??= parseServerEnv(process.env);
  return cachedEnvironment;
}
