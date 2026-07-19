import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { createSubiqLandingMetadata } from "@/public-site/sites/subiq/landing-metadata";
import { getLocalizedSubiqBlogConfig } from "@/public-site/sites/subiq/blog-config";
import { getLocalizedSubiqConfig } from "@/public-site/sites/subiq/site-config";
import { EnglishLegalNotice } from "@/public-site/sites/subiq/static-page-layout";
import enUS from "./translations/en-US.json";
import {
  getSubiqMessages,
  getSubiqTranslator,
  resolveSubiqStaticLocale,
  subiqStaticLocales,
} from "./get-subiq-translator";

function flatten(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof child === "string"
        ? [[path, child]]
        : Object.entries(flatten(child, path));
    }),
  );
}

function placeholders(value: string) {
  return [...value.matchAll(/\{([a-zA-Z][\w]*)\}|<\/?([a-zA-Z][\w]*)>/g)]
    .map((match) => match[1] ?? match[2])
    .sort();
}

describe("SubIQ static translations", () => {
  it("keeps every registered translation aligned with the English schema", () => {
    const source = flatten(enUS);
    for (const locale of subiqStaticLocales) {
      const translated = flatten(getSubiqMessages(locale));
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      for (const [key, value] of Object.entries(source))
        expect(placeholders(translated[key]!)).toEqual(placeholders(value));
    }
  });

  it("uses the registered locales with explicit English fallback", () => {
    expect(getLocalizedSubiqConfig("vi-VN").locales).toEqual(
      subiqStaticLocales,
    );
    expect(resolveSubiqStaticLocale("de-DE")).toBe("en-US");
    expect(getSubiqTranslator("vi-VN")("site.home")).toBe("Trang chủ");
    expect(getSubiqTranslator("de-DE")("site.home")).toBe("Home");
  });

  it("publishes Vietnamese static SEO and noindexes unenabled fallbacks", () => {
    const landing = createSubiqLandingMetadata("vi-VN");
    expect(landing.title).toContain("Theo dõi đăng ký");
    expect(landing.alternates?.canonical).toBe("https://getsubiq.com/vi-VN/");
    expect(landing.alternates?.languages).toMatchObject({
      "en-US": "https://getsubiq.com/",
      "vi-VN": "https://getsubiq.com/vi-VN/",
      "x-default": "https://getsubiq.com/",
    });
    expect(Object.keys(landing.alternates?.languages ?? {}).sort()).toEqual(
      [...subiqStaticLocales, "x-default"].sort(),
    );
    expect(createSubiqLandingMetadata("de-DE").robots).toMatchObject({
      index: false,
    });
    expect(createSubiqStaticPageMetadata("support", "vi-VN").title).toBe(
      "Hỗ trợ | SubIQ",
    );
  });

  it("localizes static blog presentation without changing database content", () => {
    const config = getLocalizedSubiqBlogConfig("vi-VN");
    expect(config.blog.titleLead).toBe("Hiểu rõ");
    expect(config.blog.titleAccent).toBe("những khoản bạn đang trả");
    expect(config.blog.installCta.title).toBe(
      "Theo dõi các gói đăng ký với SubIQ",
    );
  });

  it("shows a Vietnamese notice for English-only legal documents", () => {
    render(<EnglishLegalNotice locale="vi-VN" />);
    expect(
      screen.getByText("Tài liệu pháp lý này hiện chỉ có bằng tiếng Anh."),
    ).toBeInTheDocument();
  });
});
