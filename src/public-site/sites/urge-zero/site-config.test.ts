import { afterEach, describe, expect, it } from "vitest";

import { getPublicSiteIcons } from "@/public-site/config/site-icons";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("UrgeZero public configuration", () => {
  it("defines the dedicated English two-store site", () => {
    expect(urgeZeroSiteConfig).toMatchObject({
      id: "urge-zero",
      internalBasePath: "/urge-zero",
      canonicalOrigin: "https://urgezero.com",
      analyticsMeasurementId: "G-5FLBTTBYY1",
      locales: ["en-US"],
      scopeClassName: "urge-zero-site",
      theme: { routeProgressColor: "#BE9050" },
    });
    expect(urgeZeroSiteConfig.navigation.map((item) => item.label)).toEqual([
      "Home",
      "Blog",
      "FAQ",
      "Support",
    ]);
    expect(urgeZeroSiteConfig.storeBadges).toEqual([
      expect.objectContaining({
        platform: "appStore",
        imageSrc: "/urge-zero/app-store.svg",
      }),
      expect.objectContaining({
        platform: "googlePlay",
        imageSrc: "/urge-zero/google-play.svg",
      }),
    ]);
  });

  it("uses root icon URLs only on the matching deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "urge-zero";

    expect(getPublicSiteIcons(urgeZeroSiteConfig)).toMatchObject({
      icon: [{ url: "/logo.png" }],
      shortcut: "/logo.png",
    });
  });
});
