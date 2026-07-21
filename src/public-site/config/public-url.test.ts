import { describe, expect, it } from "vitest";

import {
  assertPublicProject,
  getCanonicalUrl,
  getDedicatedPublicProjectId,
  getProjectRoutePrefix,
  getPublicRouteMode,
  withPublicRoute,
} from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
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

  it("keeps nonmatching project links prefixed while compiling a dedicated site", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "jlens";

    expect(getProjectRoutePrefix(jlensSiteConfig)).toBe("");
    expect(getProjectRoutePrefix(subiqSiteConfig)).toBe("/subiq");
    expect(() => assertPublicProject("subiq", "root")).toThrow(
      "configured for jlens",
    );

    delete process.env.PUBLIC_PROJECT_ID;
    delete process.env.PUBLIC_ROUTE_MODE;
  });

  it("builds dedicated canonical URLs and never accepts another project", () => {
    expect(getCanonicalUrl(subiqSiteConfig, "en-US", "/blog/article")).toBe(
      "https://getsubiq.com/blog/article",
    );
    expect(
      getCanonicalUrl(subiqSiteConfig, "zh-Hant-TW", "/blog/article"),
    ).toBe("https://getsubiq.com/zh-Hant-TW/blog/article");
    expect(getCanonicalUrl(jlensSiteConfig, "en-US", "/support")).toBe(
      "https://jlensapp.com/support",
    );
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

  it("selects only a registered dedicated project", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "jlens";
    expect(getDedicatedPublicProjectId()).toBe("jlens");
    process.env.PUBLIC_PROJECT_ID = "skylens";
    expect(() => getDedicatedPublicProjectId()).toThrow(
      "Unknown public project",
    );
    delete process.env.PUBLIC_PROJECT_ID;
    delete process.env.PUBLIC_ROUTE_MODE;
  });

  it("rejects an unknown route mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "unexpected";
    expect(() => getPublicRouteMode()).toThrow("Unknown public route mode");
    delete process.env.PUBLIC_ROUTE_MODE;
  });
});
