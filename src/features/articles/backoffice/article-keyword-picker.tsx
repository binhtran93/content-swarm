"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import {
  findSupportedMarket,
  localeLabel,
  marketLabel,
} from "@/config/supported-locales";
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
  const locale = topic
    ? findSupportedMarket(topic.primary.countryCode, topic.primary.languageCode)
        ?.locale
    : undefined;
  return (
    <form action={action}>
      <ErrorToast message={state?.error} />
      <input name="projectId" type="hidden" value={projectId} />
      <div className="rounded-box border-base-300 bg-base-100 overflow-hidden border">
        <div className="border-base-300 flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Select a topic</h2>
            <p className="text-base-content/60 mt-0.5 text-sm">
              Only unassigned Backlog topics are shown.
            </p>
          </div>
          <span className="badge badge-ghost badge-sm mt-0.5">
            {topics.length} available
          </span>
        </div>

        <div className="max-h-[min(52vh,30rem)] space-y-2 overflow-y-auto p-3">
          {topics.map((item) => (
            <label
              className={`rounded-box hover:bg-base-200/60 flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${selected === item.id ? "border-primary bg-primary/5" : "border-transparent"}`}
              key={item.id}
            >
              <input
                checked={selected === item.id}
                className="radio radio-primary radio-sm shrink-0"
                name="keywordId"
                onChange={() => setSelected(item.id)}
                type="radio"
                value={item.primary.keywordId}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-normal">
                  {item.primary.keyword}
                </span>
              </span>
              <span className="badge badge-ghost badge-sm shrink-0">
                {marketLabel(
                  item.primary.countryCode,
                  item.primary.languageCode,
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="border-base-300 bg-base-200/30 flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-base-content/60">Source locale</span>
            <span className="ml-2 font-medium">
              {locale ? localeLabel(locale) : "—"}
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <Link
              className="btn btn-ghost btn-sm"
              href={`/admin/projects/${projectId}/articles`}
            >
              Cancel
            </Link>
            <button
              className="btn btn-primary btn-sm min-w-32"
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
