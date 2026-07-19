import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { PublicSiteConfig } from "@/public-site/config/site-config";

export type PublicRouteMode = "project" | "root";

export function getPublicRouteMode(): PublicRouteMode {
  const configured = process.env.PUBLIC_ROUTE_MODE;
  if (!configured || configured === "project") return "project";
  if (configured === "root") return "root";
  throw new Error(`Unknown public route mode: ${configured}.`);
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
  if (configured && configured !== projectId) {
    throw new Error(
      `Public deployment is configured for ${configured}, not ${projectId}.`,
    );
  }
  if (projectId !== "subiq") {
    throw new Error(`Unknown public project: ${projectId}.`);
  }
}

export function getProjectRoutePrefix(
  config: PublicSiteConfig,
  mode: PublicRouteMode = getPublicRouteMode(),
): string {
  assertPublicProject(config.id, mode);
  return mode === "root" ? "" : config.internalBasePath;
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
