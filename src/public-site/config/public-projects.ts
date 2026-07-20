export const publicProjectBasePaths = {
  jlens: "/jlens",
  skylens: "/skylens",
  subiq: "/subiq",
  "urge-zero": "/urge-zero",
} as const satisfies Record<string, `/${string}`>;

export type PublicProjectId = keyof typeof publicProjectBasePaths;

export function getPublicProjectIdFromPathname(
  pathname: string,
): PublicProjectId | undefined {
  for (const projectId of Object.keys(
    publicProjectBasePaths,
  ) as PublicProjectId[]) {
    const basePath = publicProjectBasePaths[projectId];
    if (pathname === basePath || pathname.startsWith(`${basePath}/`)) {
      return projectId;
    }
  }

  return undefined;
}
