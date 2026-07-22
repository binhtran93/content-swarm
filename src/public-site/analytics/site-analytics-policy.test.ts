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

    expect(
      isDedicatedSiteAnalyticsDeployment("jlens", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "jlens",
      }),
    ).toBe(true);

    expect(
      isDedicatedSiteAnalyticsDeployment("urge-zero", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "urge-zero",
      }),
    ).toBe(true);
  });

  it("keeps UrgeZero analytics off every non-production or mismatched build", () => {
    expect(
      isDedicatedSiteAnalyticsDeployment("urge-zero", {
        NODE_ENV: "development",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "urge-zero",
      }),
    ).toBe(false);
    expect(
      isDedicatedSiteAnalyticsDeployment("urge-zero", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "project",
        PUBLIC_PROJECT_ID: "urge-zero",
      }),
    ).toBe(false);
    expect(
      isDedicatedSiteAnalyticsDeployment("urge-zero", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "subiq",
      }),
    ).toBe(false);
  });

  it("keeps JLENS analytics disabled outside its dedicated production build", () => {
    expect(
      isDedicatedSiteAnalyticsDeployment("jlens", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "project",
        PUBLIC_PROJECT_ID: "jlens",
      }),
    ).toBe(false);
    expect(
      isDedicatedSiteAnalyticsDeployment("jlens", {
        NODE_ENV: "production",
        PUBLIC_ROUTE_MODE: "root",
        PUBLIC_PROJECT_ID: "subiq",
      }),
    ).toBe(false);
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
