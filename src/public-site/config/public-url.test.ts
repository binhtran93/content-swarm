import { describe, expect, it } from "vitest";

import {
  assertPublicProject,
  getCanonicalUrl,
  getProjectRoutePrefix,
  getPublicRouteMode,
  withPublicRoute,
} from "@/public-site/config/public-url";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

describe("public URL contract", () => {
  it("supports shared and dedicated SubIQ route shapes", () => {
    process.env.PUBLIC_PROJECT_ID = "subiq";
    expect(getProjectRoutePrefix(subiqSiteConfig, "project")).toBe("/subiq");
    expect(getProjectRoutePrefix(subiqSiteConfig, "root")).toBe("");
    expect(withPublicRoute(subiqSiteConfig, "en-US", "/blog", "project")).toBe(
      "/subiq/blog",
    );
    expect(withPublicRoute(subiqSiteConfig, "vi-VN", "/blog", "project")).toBe(
      "/subiq/vi-VN/blog",
    );
    expect(withPublicRoute(subiqSiteConfig, "en-US", "/blog", "root")).toBe(
      "/blog",
    );
    expect(withPublicRoute(subiqSiteConfig, "vi-VN", "/blog", "root")).toBe(
      "/vi-VN/blog",
    );
    delete process.env.PUBLIC_PROJECT_ID;
  });

  it("builds dedicated canonical URLs and never accepts another project", () => {
    expect(getCanonicalUrl(subiqSiteConfig, "en-US", "/blog/article")).toBe(
      "https://getsubiq.com/blog/article",
    );
    expect(
      getCanonicalUrl(subiqSiteConfig, "zh-Hant-TW", "/blog/article"),
    ).toBe("https://getsubiq.com/zh-Hant-TW/blog/article");
    expect(() => assertPublicProject("skylens")).toThrow(
      "Unknown public project",
    );
  });

  it("requires an explicit project for dedicated mode", () => {
    delete process.env.PUBLIC_PROJECT_ID;
    expect(() => assertPublicProject("subiq", "root")).toThrow(
      "PUBLIC_PROJECT_ID is required",
    );
  });

  it("rejects an unknown route mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "unexpected";
    expect(() => getPublicRouteMode()).toThrow("Unknown public route mode");
    delete process.env.PUBLIC_ROUTE_MODE;
  });
});
