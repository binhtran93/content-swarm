"use client";

import {
  NestedLexicalEditor,
  type JsxEditorProps,
  type MdastJsx,
  useMdastNodeUpdater,
} from "@mdxeditor/editor";

import styles from "./markdown-editor.module.css";

export function ArticleMdxComponentEditor({
  descriptor,
  mdastNode,
}: JsxEditorProps) {
  type FlowNode = Extract<MdastJsx, { type: "mdxJsxFlowElement" }>;

  const name = descriptor.name ?? "Component";
  const variant = stringAttribute(mdastNode, "type");
  const updateMdastNode = useMdastNodeUpdater();

  function updateCalloutType(type: string) {
    const attributes = mdastNode.attributes.filter(
      (attribute) =>
        attribute.type !== "mdxJsxAttribute" || attribute.name !== "type",
    );

    updateMdastNode({
      attributes: [
        ...attributes,
        { type: "mdxJsxAttribute", name: "type", value: type },
      ],
    });
  }

  return (
    <section
      className={styles.mdxComponent}
      data-component={name}
      data-variant={variant}
    >
      <div className={styles.mdxComponentLabel} contentEditable={false}>
        {name}
        {name === "Callout" ? (
          <select
            aria-label="Callout type"
            onChange={(event) => updateCalloutType(event.target.value)}
            value={variant ?? "info"}
          >
            <option value="default">Default</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
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
