import { describe, expect, it } from "vitest";

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

  it("rejects case-insensitive duplicate topics", () => {
    expect(() =>
      projectInputSchemas.update.parse({
        ...validInput,
        topics: ["SEO", "seo"],
      }),
    ).toThrow("Topics must be unique");
  });
});
