import { describe, expect, it } from "vitest";

import { isDedicatedSiteAnalyticsDeployment } from "./site-analytics-policy";

describe("site analytics deployment policy", () => {
  it("enables only a matching dedicated production deployment", () => {
    expect(
      isDedicatedSiteAnalyticsDeployment("subiq", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "subiq",
      }),
    ).toBe(true);
  });

  it.each([
    ["development", "root", "subiq"],
    ["production", "project", "subiq"],
    ["production", "root", "skylens"],
    ["production", undefined, "subiq"],
  ])(
    "rejects node=%s mode=%s project=%s",
    (nodeEnvironment, routeMode, projectId) => {
      expect(
        isDedicatedSiteAnalyticsDeployment("subiq", {
          NODE_ENV: nodeEnvironment,
          PUBLIC_ROUTE_MODE: routeMode,
          PUBLIC_PROJECT_ID: projectId,
        }),
      ).toBe(false);
    },
  );
});
