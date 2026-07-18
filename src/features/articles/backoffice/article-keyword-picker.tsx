"use client";

import { useActionState, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { createArticleAction } from "@/features/articles/backoffice/article-actions.server";
import type { ArticleTopic } from "@/features/keywords/model/keyword";

export function ArticleKeywordPicker({
  projectId,
  topics,
}: {
  projectId: string;
  topics: ArticleTopic[];
}) {
  const [selected, setSelected] = useState("");
  const [state, action, pending] = useActionState(createArticleAction, null);
  const topic = topics.find((item) => item.id === selected);
  return (
    <form action={action} className="space-y-5">
      <ErrorToast message={state?.error} />
      <input name="projectId" type="hidden" value={projectId} />
      <div className="card card-border bg-base-100">
        <div className="card-body gap-4 p-6">
          <div>
            <h2 className="text-lg font-medium">Choose one topic</h2>
            <p className="text-base-content/60 mt-1 text-sm">
              The selected keyword or complete group will be assigned only after
              you confirm.
            </p>
          </div>
          <div className="space-y-2">
            {topics.map((item) => (
              <label
                className={`rounded-box flex cursor-pointer gap-3 border p-4 ${selected === item.id ? "border-primary bg-primary/5" : "border-base-300"}`}
                key={item.id}
              >
                <input
                  checked={selected === item.id}
                  className="radio radio-primary radio-sm mt-1"
                  name="keywordId"
                  onChange={() => setSelected(item.id)}
                  type="radio"
                  value={item.primary.keywordId}
                />
                <span>
                  <span className="block font-medium">
                    {item.primary.keyword}
                  </span>
                  <span className="text-base-content/60 text-sm">
                    {item.primary.countryCode} · {item.primary.languageCode}
                    {item.supporting.length
                      ? ` · ${item.supporting.length} supporting keyword${item.supporting.length === 1 ? "" : "s"}`
                      : " · Individual keyword"}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <label className="fieldset max-w-xs">
            <span className="fieldset-legend">Source locale</span>
            <input
              className="input w-full"
              defaultValue={
                topic
                  ? `${topic.primary.languageCode}-${topic.primary.countryCode}`
                  : "en-US"
              }
              key={topic?.id}
              name="locale"
              pattern="[a-z]{2,3}(-[A-Z]{2})?"
              required
            />
          </label>
          {topic ? (
            <div className="alert alert-info">
              <span>
                Confirm creating an article for{" "}
                <strong>{topic.primary.keyword}</strong>. This assignment cannot
                be moved to another topic.
              </span>
            </div>
          ) : null}
          <div>
            <button
              className="btn btn-primary"
              disabled={!selected || pending}
              type="submit"
            >
              {pending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              {pending ? "Creating…" : "Create article"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
