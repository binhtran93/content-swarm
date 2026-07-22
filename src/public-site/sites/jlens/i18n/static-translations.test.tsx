import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bodoni_Moda: () => ({ variable: "font-jlens-display-bodoni" }),
  Playfair_Display: () => ({ variable: "font-jlens-display-vietnamese" }),
  Noto_Naskh_Arabic: () => ({ variable: "font-jlens-display-arabic" }),
  Noto_Serif_Devanagari: () => ({
    variable: "font-jlens-display-devanagari",
  }),
  Noto_Serif_Thai: () => ({ variable: "font-jlens-display-thai" }),
  Noto_Serif_JP: () => ({ variable: "font-jlens-display-japanese" }),
  Noto_Serif_KR: () => ({ variable: "font-jlens-display-korean" }),
  Noto_Serif_TC: () => ({
    variable: "font-jlens-display-traditional-chinese",
  }),
}));

import {
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { generateStaticParams as generateJlensLocaleParams } from "@/app/(public)/jlens/[locale]/page";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { getLocalizedJlensBlogConfig } from "@/public-site/sites/jlens/blog-config";
import { getLocalizedJlensConfig } from "@/public-site/sites/jlens/site-config";
import { JlensSiteLayout } from "@/public-site/sites/jlens/site-layout";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";
import { JlensEnglishLegalNotice } from "@/public-site/sites/jlens/static-page-layout";
import enUS from "./translations/en-US.json";
import {
  getJlensMessages,
  getJlensTranslator,
  jlensStaticLocales,
  resolveJlensStaticLocale,
} from "./get-jlens-translator";

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

function expectValidRichTags(value: string) {
  const stack: string[] = [];
  for (const match of value.matchAll(/<(\/)?([a-zA-Z][\w]*)>/g)) {
    const [, closing, tag] = match;
    if (closing) expect(stack.pop()).toBe(tag);
    else stack.push(tag!);
  }
  expect(stack).toEqual([]);
}

type RuntimeTranslator = {
  (key: string, values?: Record<string, number>): string;
  rich: (
    key: string,
    values: Record<string, number | ((chunks: ReactNode) => ReactNode)>,
  ) => ReactNode;
};

describe("JLens static translations", () => {
  it("keeps every locale aligned with the English schema", () => {
    const source = flatten(enUS);
    for (const locale of jlensStaticLocales) {
      const translated = flatten(getJlensMessages(locale));
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      for (const [key, value] of Object.entries(source)) {
        expect(placeholders(translated[key]!)).toEqual(placeholders(value));
        expectValidRichTags(translated[key]!);
      }
    }
  });

  it("registers and formats all supported locales", () => {
    expect([...jlensStaticLocales].sort()).toEqual(
      supportedLocales.map((item) => item.locale).sort(),
    );
    expect(resolveJlensStaticLocale("de-DE")).toBe("de-DE");
    expect(getJlensTranslator("vi-VN")("site.home")).toBe("Trang chủ");
    expect(getJlensTranslator("de-DE")("site.home")).not.toBe("Home");
    expect(resolveJlensStaticLocale("xx-XX" as SupportedLocaleCode)).toBe(
      "en-US",
    );
    expect(generateJlensLocaleParams()).toEqual(
      supportedLocales
        .filter((item) => item.locale !== "en-US")
        .map((item) => ({ locale: item.locale })),
    );

    const source = flatten(enUS);
    for (const locale of jlensStaticLocales) {
      const translator = getJlensTranslator(
        locale,
      ) as unknown as RuntimeTranslator;
      for (const [key, value] of Object.entries(source)) {
        const variables = Object.fromEntries(
          [...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((match) => [
            match[1],
            2,
          ]),
        );
        const tags = [
          ...new Set(
            [...value.matchAll(/<([a-zA-Z][\w]*)>/g)].map((match) => match[1]),
          ),
        ];
        if (tags.length) {
          translator.rich(key, {
            ...variables,
            ...Object.fromEntries(
              tags.map((tag) => [tag, (chunks: ReactNode) => chunks]),
            ),
          });
        } else translator(key, variables);
      }
    }
  });

  it("publishes localized SEO and English-only legal metadata", () => {
    const landing = createJlensLandingMetadata("vi-VN");
    expect(landing.title).toContain("trang sức");
    expect(landing.alternates?.canonical).toBe("https://jlensapp.com/vi-VN/");
    expect(landing.alternates?.languages).toMatchObject({
      "en-US": "https://jlensapp.com/",
      "vi-VN": "https://jlensapp.com/vi-VN/",
      "x-default": "https://jlensapp.com/",
    });
    expect(createJlensStaticPageMetadata("support", "de-DE").title).toBe(
      "Unterstützung | JLens",
    );
    const privacy = createJlensStaticPageMetadata("privacy", "vi-VN");
    expect(privacy.alternates?.canonical).toBe("https://jlensapp.com/privacy");
    expect(privacy.robots).toMatchObject({ index: false, follow: true });
  });

  it("localizes Blog chrome, legal notices, and RTL direction", () => {
    expect(getLocalizedJlensBlogConfig("vi-VN").blog.titleLead).not.toBe(
      "Jewelry",
    );
    render(<JlensEnglishLegalNotice locale="vi-VN" />);
    expect(
      screen.getByText("Tài liệu pháp lý này hiện chỉ có bằng tiếng Anh."),
    ).toBeInTheDocument();

    const { container } = render(
      <AcquisitionProvider
        acquisition={{
          mode: "stores",
          appStoreUrl: null,
          googlePlayUrl: null,
        }}
        brandName="JLens"
        defaultLocale="en-US"
        presentations={{
          "en-US": {
            waitlist: getLocalizedJlensConfig("en-US").waitlist,
            availability: "Availability",
            submitting: "Joining…",
            done: "Done",
            close: "Close",
            notConfigured: "Unavailable",
            genericError: "Try again",
            consent: "Consent",
            privacyPolicy: "Privacy Policy",
          },
        }}
        projectId="jlens"
        scopeClassName="jlens-site"
        siteKey=""
      >
        <JlensSiteLayout locale="ar-SA">
          <main>المحتوى</main>
        </JlensSiteLayout>
      </AcquisitionProvider>,
    );
    expect(container.querySelector(".jlens-site")).toHaveAttribute(
      "dir",
      "rtl",
    );
    expect(getLocalizedJlensConfig("ar-SA").navigation[0]?.label).toBe(
      "الصفحة الرئيسية",
    );
  });
});
