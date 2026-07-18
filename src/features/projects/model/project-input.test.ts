import { describe, expect, it } from "vitest";

import { projectInputSchemas } from "@/features/projects/model/project-input";

const validInput = {
  projectId: "subiq",
  name: " SubIQ ",
  description: " Product context ",
  canonicalBaseUrl: "https://getsubiq.com",
  topics: ["SEO", "Content"],
};

describe("project input", () => {
  it("normalizes editable text and an omitted publication URL", () => {
    expect(
      projectInputSchemas.create.parse({
        ...validInput,
        canonicalBaseUrl: "  ",
      }),
    ).toMatchObject({
      projectId: "subiq",
      name: "SubIQ",
      description: "Product context",
      canonicalBaseUrl: null,
    });
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

  it.each(["http://getsubiq.com", "https://getsubiq.com/", "getsubiq.com"])(
    "rejects invalid canonical URL %s",
    (canonicalBaseUrl) => {
      expect(() =>
        projectInputSchemas.create.parse({ ...validInput, canonicalBaseUrl }),
      ).toThrow();
    },
  );

  it("allows an HTTPS canonical URL with a project path", () => {
    expect(
      projectInputSchemas.create.parse({
        ...validInput,
        canonicalBaseUrl: "https://anmisoft.com/subiq",
      }).canonicalBaseUrl,
    ).toBe("https://anmisoft.com/subiq");
  });

  it("rejects case-insensitive duplicate topics", () => {
    expect(() =>
      projectInputSchemas.update.parse({
        ...validInput,
        topics: ["SEO", "seo"],
      }),
    ).toThrow("Topics must be unique");
  });
});
