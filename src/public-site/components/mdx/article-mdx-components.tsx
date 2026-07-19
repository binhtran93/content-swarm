import type { ElementType } from "react";
import { Bleed, Callout, Cards, Steps, Table, Tabs } from "nextra/components";

import type { ArticleMdxComponentName } from "@/features/articles/config/article-mdx-components";

export const articleMdxComponents = {
  Bleed,
  Callout,
  Cards,
  Steps,
  Table,
  Tabs,
} satisfies Record<ArticleMdxComponentName, ElementType>;
