const defaultAdminPath = "/admin/projects";

export function getSafeAdminNextPath(
  value: string | string[] | undefined,
): string {
  const path = Array.isArray(value) ? value[0] : value;
  if (!path || path.startsWith("//") || !/^\/admin(?:$|[/?#])/.test(path)) {
    return defaultAdminPath;
  }

  try {
    const url = new URL(path, "https://anmisoft.local");
    return url.origin === "https://anmisoft.local"
      ? `${url.pathname}${url.search}${url.hash}`
      : defaultAdminPath;
  } catch {
    return defaultAdminPath;
  }
}
