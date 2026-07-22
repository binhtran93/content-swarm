"use client";

import {
  NestedLexicalEditor,
  type JsxEditorProps,
  type MdastJsx,
  useMdastNodeUpdater,
} from "@mdxeditor/editor";

import articleContentStyles from "@/features/articles/presentation/article-content.module.css";
import styles from "./markdown-editor.module.css";

const presentationClasses: Partial<Record<string, string>> = {
  Callout: articleContentStyles.callout,
  Cards: articleContentStyles.cards,
  "Cards.Card": articleContentStyles.card,
  Steps: articleContentStyles.steps,
};

export function ArticleMdxComponentEditor({
  descriptor,
  mdastNode,
}: JsxEditorProps) {
  type FlowNode = Extract<MdastJsx, { type: "mdxJsxFlowElement" }>;

  const name = descriptor.name ?? "Component";
  const variant = stringAttribute(mdastNode, "type");
  const title = stringAttribute(mdastNode, "title");
  const updateMdastNode = useMdastNodeUpdater();

  function updateStringAttribute(attributeName: string, value: string) {
    const attributes = mdastNode.attributes.filter(
      (attribute) =>
        attribute.type !== "mdxJsxAttribute" ||
        attribute.name !== attributeName,
    );

    updateMdastNode({
      attributes: [
        ...attributes,
        {
          type: "mdxJsxAttribute",
          name: attributeName,
          value,
        },
      ],
    });
  }

  return (
    <section
      className={`${styles.mdxComponent} ${presentationClasses[name] ?? ""}`}
      data-component={name}
      data-variant={variant}
    >
      <div className={styles.mdxComponentLabel} contentEditable={false}>
        {name}
        {name === "Callout" ? (
          <select
            aria-label="Callout type"
            onChange={(event) =>
              updateStringAttribute("type", event.target.value)
            }
            value={variant ?? "info"}
          >
            <option value="default">Default</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        ) : null}
        {name === "Tab" ? (
          <input
            aria-label="Tab title"
            onChange={(event) =>
              updateStringAttribute("title", event.target.value)
            }
            type="text"
            value={title ?? ""}
          />
        ) : null}
      </div>
      <NestedLexicalEditor<FlowNode>
        block
        getContent={(node) => node.children}
        getUpdatedMdastNode={(node, children) => ({
          ...node,
          children: children as FlowNode["children"],
        })}
      />
    </section>
  );
}

function stringAttribute(node: MdastJsx, name: string): string | undefined {
  const attribute = node.attributes.find(
    (candidate) =>
      candidate.type === "mdxJsxAttribute" && candidate.name === name,
  );

  return typeof attribute?.value === "string" ? attribute.value : undefined;
}
