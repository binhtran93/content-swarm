import type { ElementType, ReactNode } from "react";
import {
  Bleed,
  Callout,
  Cards,
  Steps,
  Table as NextraTable,
  Tabs,
} from "nextra/components";

import type { ArticleMdxComponentName } from "@/features/articles/config/article-mdx-components";

function ArticleTableGroup({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export const articleMdxComponents = {
  Bleed,
  Callout,
  Cards,
  Steps,
  Table: ArticleTableGroup,
  Tabs,
  table: NextraTable,
} satisfies Record<ArticleMdxComponentName, ElementType> & {
  table: ElementType;
};
