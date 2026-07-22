import {
  Children,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Bleed,
  Callout,
  Cards,
  Steps,
  Table as NextraTable,
  Tabs as NextraTabs,
} from "nextra/components";

import type { ArticleMdxComponentName } from "@/features/articles/config/article-mdx-components";

function ArticleTableGroup({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

type ArticleTabProps = { children?: ReactNode; title: string };

function ArticleTab({ children }: ArticleTabProps) {
  return <NextraTabs.Tab>{children}</NextraTabs.Tab>;
}

function ArticleTabs({ children }: { children?: ReactNode }) {
  const panels = Children.toArray(children).filter(isArticleTabElement);
  const items = panels.map((panel) => panel.props.title);

  return <NextraTabs items={items}>{panels}</NextraTabs>;
}

function isArticleTabElement(
  child: ReactNode,
): child is ReactElement<ArticleTabProps> {
  return isValidElement<ArticleTabProps>(child) && child.type === ArticleTab;
}

export const articleMdxComponents = {
  Bleed,
  Callout,
  Cards,
  Steps,
  Tab: ArticleTab,
  Table: ArticleTableGroup,
  Tabs: ArticleTabs,
  table: NextraTable,
} satisfies Record<ArticleMdxComponentName, ElementType> & {
  table: ElementType;
};
