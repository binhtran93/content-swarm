import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicSiteConfig } from "@/public-site/config/site-config";

export type PublicRouteMode = "project" | "root";

const fullPublicProjectIds = ["jlens", "subiq", "urge-zero"] as const;

export type FullPublicProjectId = (typeof fullPublicProjectIds)[number];

export function isFullPublicProjectId(
  projectId: string,
): projectId is FullPublicProjectId {
  return fullPublicProjectIds.includes(projectId as FullPublicProjectId);
}

export function isPublicProjectDisabled(projectId: string): boolean {
  return (process.env.PUBLIC_DISABLED_PROJECTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(projectId);
}

export function getPublicRouteMode(): PublicRouteMode {
  const configured = process.env.PUBLIC_ROUTE_MODE;
  if (!configured || configured === "project") return "project";
  if (configured === "root") return "root";
  throw new Error(`Unknown public route mode: ${configured}.`);
}

export function getDedicatedPublicProjectId(): FullPublicProjectId {
  if (getPublicRouteMode() !== "root") {
    throw new Error("Dedicated public project requires root route mode.");
  }
  return getConfiguredPublicProjectId();
}

function getConfiguredPublicProjectId(): FullPublicProjectId {
  const configured = process.env.PUBLIC_PROJECT_ID;
  if (!configured) {
    throw new Error(
      "PUBLIC_PROJECT_ID is required for a dedicated public deployment.",
    );
  }
  if (!isFullPublicProjectId(configured)) {
    throw new Error(`Unknown public project: ${configured}.`);
  }
  return configured;
}

export function assertPublicProject(
  projectId: string,
  mode: PublicRouteMode = getPublicRouteMode(),
): void {
  const configured = process.env.PUBLIC_PROJECT_ID;
  if (mode === "root" && !configured) {
    throw new Error(
      "PUBLIC_PROJECT_ID is required for a dedicated public deployment.",
    );
  }
  if (mode === "root" && configured && configured !== projectId) {
    throw new Error(
      `Public deployment is configured for ${configured}, not ${projectId}.`,
    );
  }
  if (!isFullPublicProjectId(projectId)) {
    throw new Error(`Unknown public project: ${projectId}.`);
  }
}

export function getProjectRoutePrefix(
  config: PublicSiteConfig,
  mode: PublicRouteMode = getPublicRouteMode(),
): string {
  assertPublicProject(config.id, "project");
  if (mode === "project") return config.internalBasePath;

  return getConfiguredPublicProjectId() === config.id
    ? ""
    : config.internalBasePath;
}

export function withPublicRoute(
  config: PublicSiteConfig,
  locale: SupportedLocaleCode,
  href: string,
  mode: PublicRouteMode = getPublicRouteMode(),
): string {
  if (/^(?:https?:|mailto:|tel:|#)/.test(href)) return href;
  const routePrefix = getProjectRoutePrefix(config, mode);
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  return `${routePrefix}${localePrefix}${href === "/" ? "/" : href}`;
}

export function getCanonicalUrl(
  config: PublicSiteConfig,
  locale: SupportedLocaleCode,
  href: string,
): string {
  assertPublicProject(config.id, "project");
  const localePrefix = locale === config.defaultLocale ? "" : `/${locale}`;
  return new URL(
    `${localePrefix}${href === "/" ? "/" : href}`,
    `${config.canonicalOrigin}/`,
  ).toString();
}
