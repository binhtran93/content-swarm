export function isDedicatedSiteAnalyticsDeployment(
  siteId: string,
  environment: Record<string, string | undefined>,
): boolean {
  return (
    environment.NODE_ENV === "production" &&
    environment.PUBLIC_ROUTE_MODE === "root" &&
    environment.PUBLIC_PROJECT_ID === siteId
  );
}
