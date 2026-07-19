"use client";

import type { ForwardedRef } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeMirrorEditor,
  CreateLink,
  ListsToggle,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  type JsxComponentDescriptor,
  Separator,
  UndoRedo,
  headingsPlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

import { ArticleMdxComponentEditor } from "@/features/articles/backoffice/article-mdx-component-editor";
import { articleMdxComponentDefinitions } from "@/features/articles/config/article-mdx-components";

type InitializedMarkdownEditorProps = MDXEditorProps & {
  editorRef: ForwardedRef<MDXEditorMethods>;
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = Object.entries(
  articleMdxComponentDefinitions,
).map(([name, definition]) => ({
  name,
  kind: "flow",
  props: definition.properties.map((property) => ({ ...property })),
  hasChildren: true,
  Editor: ArticleMdxComponentEditor,
}));

export default function InitializedMarkdownEditor({
  editorRef,
  ...props
}: InitializedMarkdownEditorProps) {
  return (
    <MDXEditor
      {...props}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        codeBlockPlugin({
          codeBlockEditorDescriptors: [
            {
              priority: 0,
              match: () => true,
              Editor: CodeMirrorEditor,
            },
          ],
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            "": "Plain text",
            bash: "Bash",
            css: "CSS",
            html: "HTML",
            javascript: "JavaScript",
            json: "JSON",
            mdx: "MDX",
            tsx: "TSX",
            typescript: "TypeScript",
          },
        }),
        jsxPlugin({ jsxComponentDescriptors }),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle options={["bullet", "number"]} />
              <CreateLink />
            </>
          ),
        }),
      ]}
      ref={editorRef}
    />
  );
}
