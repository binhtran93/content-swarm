"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import styles from "./markdown-editor.module.css";

const InitializedMarkdownEditor = dynamic(
  () => import("./initialized-markdown-editor"),
  {
    loading: () => (
      <div className="border-base-300 bg-base-100 flex min-h-0 flex-1 items-center justify-center border">
        <span className="loading loading-spinner loading-sm" />
      </div>
    ),
    ssr: false,
  },
);

type MarkdownEditorProps = {
  className?: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  value: string;
};

export function MarkdownEditor({
  className = "",
  onChange,
  placeholder,
  value,
}: MarkdownEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    const editor = editorRef.current;

    if (editor && editor.getMarkdown() !== value) {
      editor.setMarkdown(value);
    }
  }, [value]);

  return (
    <InitializedMarkdownEditor
      className={`${styles.editor} ${className}`}
      contentEditableClassName={styles.content}
      editorRef={editorRef}
      markdown={value}
      onChange={onChange as MDXEditorProps["onChange"]}
      placeholder={placeholder}
      spellCheck
    />
  );
}
