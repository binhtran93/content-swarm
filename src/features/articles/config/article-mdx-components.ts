export const articleMdxComponentDefinitions = {
  Bleed: {
    description: "A full-width visual or content region.",
    properties: [],
  },
  Callout: {
    description: "A short note, warning, tip, or important aside.",
    properties: [{ name: "type", type: "string" }],
  },
  Cards: {
    description: "A small collection of related linked choices.",
    properties: [],
  },
  Steps: {
    description: "An ordered sequence of actions.",
    properties: [],
  },
  Table: {
    description: "A responsive wrapper around one Markdown table.",
    properties: [],
  },
  Tabs: {
    description: "Parallel alternatives that readers switch between.",
    properties: [],
  },
} as const;

export type ArticleMdxComponentName =
  keyof typeof articleMdxComponentDefinitions;

export const articleMdxComponentDescriptions = Object.fromEntries(
  Object.entries(articleMdxComponentDefinitions).map(([name, definition]) => [
    name,
    definition.description,
  ]),
) as Record<ArticleMdxComponentName, string>;
