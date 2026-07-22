import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bebas_Neue: () => ({ variable: "font-urge-zero-display" }),
  Bodoni_Moda: () => ({ variable: "font-jlens-display" }),
  Inter: () => ({ variable: "font-urge-zero-body" }),
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
