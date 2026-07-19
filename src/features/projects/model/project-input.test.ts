import { describe, expect, it } from "vitest";

import { projectAcquisitionSchema } from "@/features/projects/model/project-acquisition";
import { projectInputSchemas } from "@/features/projects/model/project-input";

const validInput = {
  projectId: "subiq",
  name: " SubIQ ",
  description: " Product context ",
  topics: ["SEO", "Content"],
};

describe("project input", () => {
  it("normalizes editable text", () => {
    expect(projectInputSchemas.create.parse(validInput)).toMatchObject({
      projectId: "subiq",
      name: "SubIQ",
      description: "Product context",
      acquisition: {
        mode: "waitlist",
        appStoreUrl: null,
        googlePlayUrl: null,
      },
    });
  });

  it("allows a staggered launch with one valid store URL", () => {
    expect(
      projectAcquisitionSchema.parse({
        mode: "stores",
        appStoreUrl: "https://apps.apple.com/us/app/subiq/id123456789",
        googlePlayUrl: "",
      }),
    ).toEqual({
      mode: "stores",
      appStoreUrl: "https://apps.apple.com/us/app/subiq/id123456789",
      googlePlayUrl: null,
    });
  });

  it("requires a store URL before store mode is enabled", () => {
    expect(() =>
      projectAcquisitionSchema.parse({
        mode: "stores",
        appStoreUrl: "",
        googlePlayUrl: "",
      }),
    ).toThrow("Add at least one store URL");
  });

  it.each([
    ["appStoreUrl", "https://example.com/app/id123"],
    ["googlePlayUrl", "https://example.com/store/apps/details?id=app"],
    ["googlePlayUrl", "https://play.google.com/store/apps/details"],
  ])("rejects an invalid %s", (field, url) => {
    expect(() =>
      projectAcquisitionSchema.parse({
        mode: "waitlist",
        appStoreUrl: null,
        googlePlayUrl: null,
        [field]: url,
      }),
    ).toThrow();
  });

  it("accepts an empty optional AI product description", () => {
    expect(
      projectInputSchemas.create.parse({
        ...validInput,
        description: "  ",
      }).description,
    ).toBe("");
  });

  it.each(["SubIQ", "sub_iq", "-subiq", "subiq/keywords"])(
    "rejects unstable project ID %s",
    (projectId) => {
      expect(() =>
        projectInputSchemas.create.parse({ ...validInput, projectId }),
      ).toThrow();
    },
  );

  it("rejects case-insensitive duplicate topics", () => {
    expect(() =>
      projectInputSchemas.update.parse({
        ...validInput,
        topics: ["SEO", "seo"],
      }),
    ).toThrow("Topics must be unique");
  });
});
