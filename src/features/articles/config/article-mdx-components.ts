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
  Tab: {
    description: "One titled panel placed directly inside Tabs.",
    properties: [{ name: "title", type: "string" }],
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

export const articleMdxAuthoringGuide = `
Article MDX is static. Never use import, export, raw HTML, JavaScript expressions, or curly braces. Use only the component forms below.

Tabs require at least two direct Tab children with non-empty, unique string titles:
<Tabs>
  <Tab title="First option">
    Markdown for the first option.
  </Tab>
  <Tab title="Second option">
    Markdown for the second option.
  </Tab>
</Tabs>
Never use Nextra items, items={...}, Tabs.Tab, selectedIndex, onChange, or other Tabs props.

Wrap one Markdown table in Table:
<Table>

| Choice | Tradeoff |
| --- | --- |
| Example | Explanation |

</Table>

Steps contain Markdown headings followed by their content:
<Steps>

### First step

Complete the first action.

### Second step

Complete the second action.

</Steps>

Callout accepts only a quoted type of default, info, warning, or error:
<Callout type="info">Markdown note.</Callout>

Bleed, Cards, and the other approved components may be used only with quoted string attributes. Omit optional expression-based props, icons, event handlers, and component expressions.
`.trim();
