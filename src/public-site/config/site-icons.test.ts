import { afterEach, describe, expect, it } from "vitest";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

describe("public site icons", () => {
  afterEach(() => {
    delete process.env.PUBLIC_PROJECT_ID;
    delete process.env.PUBLIC_ROUTE_MODE;
  });

  it("uses the project path on the shared deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "project";
    expect(getPublicSiteIcons(subiqSiteConfig)).toMatchObject({
      icon: [{ url: "/subiq/favicon.png" }],
      shortcut: "/subiq/favicon.png",
    });
  });

  it("uses the root path on the dedicated SubIQ deployment", () => {
    process.env.PUBLIC_PROJECT_ID = "subiq";
    process.env.PUBLIC_ROUTE_MODE = "root";
    expect(getPublicSiteIcons(subiqSiteConfig)).toMatchObject({
      icon: [{ url: "/favicon.png" }],
      shortcut: "/favicon.png",
    });
  });
});
