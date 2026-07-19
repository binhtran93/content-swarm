"use client";

import type { ForwardedRef } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

type InitializedMarkdownEditorProps = MDXEditorProps & {
  editorRef: ForwardedRef<MDXEditorMethods>;
};

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
