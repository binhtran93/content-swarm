import { describe, expect, it } from "vitest";

import { supportedLocales } from "@/config/supported-locales";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

describe("SubIQ public configuration", () => {
  it("uses the platform locale catalog verbatim", () => {
    expect(subiqSiteConfig.locales).toEqual(
      supportedLocales.map((item) => item.locale),
    );
    expect(subiqSiteConfig.locales).toHaveLength(21);
    expect(subiqSiteConfig.locales).toContain("zh-Hant-TW");
    expect(subiqSiteConfig.locales).not.toContain("ru-RU");
  });

  it("contains only SubIQ presentation data", () => {
    expect(subiqSiteConfig).toMatchObject({
      id: "subiq",
      internalBasePath: "/subiq",
      canonicalOrigin: "https://getsubiq.com",
      scopeClassName: "subiq-site",
    });
  });
});
