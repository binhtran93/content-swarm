import { z } from "zod";

export const defaultProjectAcquisition = {
  mode: "waitlist",
  appStoreUrl: null,
  googlePlayUrl: null,
} as const;

function storeUrl(label: string, validate: (url: URL) => boolean) {
  return z
    .union([z.string(), z.null()])
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .refine((value) => {
      if (value === null || value === "") return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" && validate(url);
      } catch {
        return false;
      }
    }, `Enter a valid ${label} URL.`)
    .transform((value) => (value === "" ? null : value));
}

const appStoreUrl = storeUrl(
  "App Store",
  (url) => url.hostname === "apps.apple.com" && url.pathname !== "/",
);

const googlePlayUrl = storeUrl(
  "Google Play",
  (url) =>
    url.hostname === "play.google.com" &&
    url.pathname === "/store/apps/details" &&
    Boolean(url.searchParams.get("id")),
);

export const projectAcquisitionSchema = z
  .object({
    mode: z.enum(["waitlist", "stores"]),
    appStoreUrl,
    googlePlayUrl,
  })
  .superRefine((value, context) => {
    if (value.mode === "stores" && !value.appStoreUrl && !value.googlePlayUrl) {
      context.addIssue({
        code: "custom",
        path: ["mode"],
        message: "Add at least one store URL before enabling store mode.",
      });
    }
  });

export type ProjectAcquisition = z.infer<typeof projectAcquisitionSchema>;
