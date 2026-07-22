import { afterEach, describe, expect, it } from "vitest";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { supportedLocales } from "@/config/supported-locales";
import {
  getLocalizedJlensConfig,
  jlensSiteConfig,
} from "@/public-site/sites/jlens/site-config";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("JLens public configuration", () => {
  it("defines a dedicated localized store-acquisition site", () => {
    expect(jlensSiteConfig).toMatchObject({
      id: "jlens",
      internalBasePath: "/jlens",
      canonicalOrigin: "https://jlensapp.com",
      analyticsMeasurementId: "G-R89Z9ZW09F",
      locales: supportedLocales.map((item) => item.locale),
      scopeClassName: "jlens-site",
      theme: { routeProgressColor: "#8a6724" },
    });
    expect(jlensSiteConfig.navigation.map((item) => item.label)).toEqual([
      "Home",
      "Blog",
      "FAQ",
      "Support",
    ]);
    expect(jlensSiteConfig.storeBadges).toHaveLength(2);
    expect(getLocalizedJlensConfig("vi-VN").navigation[0]?.label).toBe(
      "Trang chủ",
    );
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
