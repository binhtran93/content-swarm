import { describe, expect, it } from "vitest";

import { supportedLocales } from "@/config/supported-locales";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import { getLocalizedSubiqConfig } from "@/public-site/sites/subiq/site-config";
import { subiqStaticLocales } from "@/public-site/sites/subiq/i18n/get-subiq-translator";

describe("SubIQ public configuration", () => {
  it("uses the platform locale catalog verbatim", () => {
    expect(subiqSiteConfig.locales).toEqual(
      supportedLocales.map((item) => item.locale),
    );
    expect(subiqSiteConfig.locales).toHaveLength(21);
    expect(subiqSiteConfig.locales).toContain("zh-Hant-TW");
    expect(subiqSiteConfig.locales).not.toContain("ru-RU");
  });

  it("exposes only reviewed static locales in localized presentation", () => {
    const config = getLocalizedSubiqConfig("vi-VN");
    expect(config.locales).toEqual(subiqStaticLocales);
    expect(config.navigation[0]?.label).toBe("Trang chủ");
    expect(config.waitlist.ctaLabel).toBe("Tham gia danh sách chờ");
  });

  it("contains only SubIQ presentation data", () => {
    expect(subiqSiteConfig).toMatchObject({
      id: "subiq",
      internalBasePath: "/subiq",
      canonicalOrigin: "https://getsubiq.com",
      scopeClassName: "subiq-site",
      theme: { routeProgressColor: "#2e7d32" },
    });
  });
});
