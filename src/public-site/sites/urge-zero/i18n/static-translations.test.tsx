import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bebas_Neue: () => ({ variable: "font-urge-zero-display" }),
  Inter: () => ({ variable: "font-urge-zero-body" }),
  Oswald: () => ({ variable: "font-urge-zero-display-vietnamese" }),
  Noto_Sans_Arabic: () => ({ variable: "font-urge-zero-arabic" }),
  Noto_Sans_Devanagari: () => ({ variable: "font-urge-zero-devanagari" }),
  Noto_Sans_Thai: () => ({ variable: "font-urge-zero-thai" }),
  Noto_Sans_JP: () => ({ variable: "font-urge-zero-japanese" }),
  Noto_Sans_KR: () => ({ variable: "font-urge-zero-korean" }),
  Noto_Sans_TC: () => ({ variable: "font-urge-zero-traditional-chinese" }),
}));

import { generateStaticParams } from "@/app/(public)/urge-zero/[locale]/page";
import {
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { getLocalizedUrgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";
import { getLocalizedUrgeZeroConfig } from "@/public-site/sites/urge-zero/site-config";
import { UrgeZeroSiteLayout } from "@/public-site/sites/urge-zero/site-layout";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";
import { UrgeZeroEnglishLegalNotice } from "@/public-site/sites/urge-zero/static-page-layout";
import enUS from "./translations/en-US.json";
import {
  getUrgeZeroMessages,
  getUrgeZeroTranslator,
  resolveUrgeZeroStaticLocale,
  urgeZeroStaticLocales,
} from "./get-urge-zero-translator";

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
function tokens(value: string) {
  return [...value.matchAll(/\{([a-zA-Z][\w]*)\}|<(\/)?([a-zA-Z][\w]*)>/g)]
    .map((match) => match[1] ?? `${match[2] ?? ""}${match[3]}`)
    .sort();
}
function expectValidRichTags(value: string) {
  const stack: string[] = [];
  for (const match of value.matchAll(/<(\/)?([a-zA-Z][\w]*)>/g)) {
    if (match[1]) expect(stack.pop()).toBe(match[2]);
    else stack.push(match[2]!);
  }
  expect(stack).toEqual([]);
}

describe("UrgeZero static translations", () => {
  it("keeps all catalogs aligned with the English schema and formatting", () => {
    const source = flatten(enUS);
    expect([...urgeZeroStaticLocales].sort()).toEqual(
      supportedLocales.map((item) => item.locale).sort(),
    );
    for (const locale of urgeZeroStaticLocales) {
      const translated = flatten(getUrgeZeroMessages(locale));
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      for (const [key, value] of Object.entries(source)) {
        const localized = translated[key]!;
        expect(tokens(localized)).toEqual(tokens(value));
        expectValidRichTags(localized);
        expect(localized).not.toMatch(/<([a-zA-Z][\w]*)>\s*<\/\1>/);
        expect(localized).not.toMatch(/SubIQ|JLens|UZPROTECT|URGEZERO_/);
      }
    }
  });

  it("loads representative translations and locale routes", () => {
    expect(getUrgeZeroTranslator("vi-VN")("site.home")).toBe("Trang chủ");
    expect(getUrgeZeroMessages("vi-VN").landing.heroTitle).toBe(
      "<accent>Cai nội dung khiêu dâm</accent>, vượt qua từng cơn thôi thúc",
    );
    expect(getUrgeZeroMessages("vi-VN").landing.heroDescription).not.toMatch(
      /nhu cầu khiêu dâm|đặt lại|điều gì xảy ra tiếp theo/i,
    );
    expect(getUrgeZeroTranslator("de-DE")("site.home")).not.toBe("Home");
    expect(resolveUrgeZeroStaticLocale("xx-XX" as SupportedLocaleCode)).toBe(
      "en-US",
    );
    expect(generateStaticParams()).toEqual(
      supportedLocales
        .filter((item) => item.locale !== "en-US")
        .map((item) => ({ locale: item.locale })),
    );
  });

  it("publishes localized SEO and English-only legal metadata", () => {
    const landing = createUrgeZeroLandingMetadata("vi-VN");
    expect(landing.title).not.toBe(enUS.seo.landingTitle);
    expect(landing.alternates?.canonical).toBe("https://urgezero.com/vi-VN/");
    expect(landing.alternates?.languages).toMatchObject({
      "en-US": "https://urgezero.com/",
      "vi-VN": "https://urgezero.com/vi-VN/",
      "x-default": "https://urgezero.com/",
    });
    expect(createUrgeZeroStaticPageMetadata("support", "de-DE").title).not.toBe(
      "Support | UrgeZero",
    );
    const privacy = createUrgeZeroStaticPageMetadata("privacy", "vi-VN");
    expect(privacy.alternates?.canonical).toBe("https://urgezero.com/privacy");
    expect(privacy.robots).toMatchObject({ index: false, follow: true });
  });

  it("localizes Blog chrome, legal notices, and RTL direction", () => {
    expect(getLocalizedUrgeZeroBlogConfig("vi-VN").blog.titleLead).not.toBe(
      enUS.blog.titleLead,
    );
    render(<UrgeZeroEnglishLegalNotice locale="vi-VN" />);
    expect(
      screen.getByText(getUrgeZeroMessages("vi-VN").site.legalEnglishNotice),
    ).toBeInTheDocument();
    const { container } = render(
      <AcquisitionProvider
        acquisition={{ mode: "stores", appStoreUrl: null, googlePlayUrl: null }}
        brandName="UrgeZero"
        defaultLocale="en-US"
        presentations={{
          "en-US": {
            waitlist: getLocalizedUrgeZeroConfig("en-US").waitlist,
            availability: "Availability",
            submitting: "Joining",
            done: "Done",
            close: "Close",
            notConfigured: "Unavailable",
            genericError: "Error",
            consent: "Consent",
            privacyPolicy: "Privacy",
          },
        }}
        projectId="urge-zero"
        scopeClassName="urge-zero-site"
        siteKey=""
      >
        <UrgeZeroSiteLayout locale="ar-SA">
          <main>المحتوى</main>
        </UrgeZeroSiteLayout>
      </AcquisitionProvider>,
    );
    expect(container.querySelector(".urge-zero-site")).toHaveAttribute(
      "dir",
      "rtl",
    );
    expect(getLocalizedUrgeZeroConfig("ar-SA").navigation[0]?.label).not.toBe(
      "Home",
    );
  });
});
