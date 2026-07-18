import "server-only";

export const ownerSessionConfig = {
  cookieName: "__session",
  maxAgeSeconds: 60 * 60 * 24 * 5,
} as const;
