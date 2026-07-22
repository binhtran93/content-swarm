import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bebas_Neue: () => ({ variable: "font-urge-zero-display" }),
  Bodoni_Moda: () => ({ variable: "font-jlens-display-bodoni" }),
  Inter: () => ({ variable: "font-urge-zero-body" }),
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

import HomePage, { generateMetadata } from "@/app/(public)/page";
import { UrgeZeroAcquisitionBoundary } from "@/public-site/sites/urge-zero/acquisition-boundary";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("dedicated root landing selection", () => {
  it("selects the UrgeZero metadata and boundary explicitly", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "urge-zero";

    expect(generateMetadata()).toMatchObject({
      title: "Quit Porn & Handle Urges in the Moment | UrgeZero",
      alternates: { canonical: "https://urgezero.com/" },
    });
    expect((HomePage() as ReactElement).type).toBe(UrgeZeroAcquisitionBoundary);
  });

  it("fails closed instead of rendering another site for an unknown ID", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "skylens";

    expect(() => generateMetadata()).toThrow("Unknown public project");
    expect(() => HomePage()).toThrow("Unknown public project");
  });
});
