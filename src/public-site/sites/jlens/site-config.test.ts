import { afterEach, describe, expect, it } from "vitest";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("JLens public configuration", () => {
  it("defines a dedicated English store-acquisition site", () => {
    expect(jlensSiteConfig).toMatchObject({
      id: "jlens",
      internalBasePath: "/jlens",
      canonicalOrigin: "https://jlensapp.com",
      analyticsMeasurementId: "G-R89Z9ZW09F",
      locales: ["en-US"],
      scopeClassName: "jlens-site",
      theme: { routeProgressColor: "#8a6724" },
    });
    expect(jlensSiteConfig.navigation.map((item) => item.label)).toEqual([
      "Home",
      "Features",
      "Collection",
      "FAQ",
      "Support",
    ]);
    expect(jlensSiteConfig.storeBadges).toHaveLength(2);
  });

  it("uses root icon URLs only on its matching dedicated deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "jlens";
    expect(getPublicSiteIcons(jlensSiteConfig)).toMatchObject({
      icon: [{ url: "/favicon.png" }],
      shortcut: "/favicon.png",
    });
  });
});
