"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
  const parseErrorRef = useRef<string | undefined>(undefined);
  const [parseError, setParseError] = useState<string>();

  const handleChange: NonNullable<MDXEditorProps["onChange"]> = (markdown) => {
    queueMicrotask(() => {
      if (!parseErrorRef.current) onChange(markdown);
    });
  };

  const handleError: NonNullable<MDXEditorProps["onError"]> = ({ error }) => {
    parseErrorRef.current = error;
    setParseError(error);
  };

  useEffect(() => {
    const editor = editorRef.current;

    if (editor && editor.getMarkdown() !== value) {
      parseErrorRef.current = undefined;
      setParseError(undefined);
      editor.setMarkdown(value);
    }
  }, [value]);

  return (
    <>
      {parseError ? (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-error max-w-md shadow-lg">
            <span>
              This MDX cannot be displayed completely. The original content was
              preserved. {parseError}
            </span>
          </div>
        </div>
      ) : null}
      <InitializedMarkdownEditor
        className={`${styles.editor} ${className}`}
        contentEditableClassName={styles.content}
        editorRef={editorRef}
        markdown={value}
        onChange={handleChange}
        onError={handleError}
        placeholder={placeholder}
        spellCheck
      />
    </>
  );
}
