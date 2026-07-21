"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  type ArticleAutomationActionState,
  updateArticleAutomationAction,
} from "@/features/articles/automation/article-automation-actions.server";
import type { ArticleAutomationSettings } from "@/features/articles/automation/article-automation-model";
import { ErrorToast } from "@/backoffice/components/ui/error-toast";

function dateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not yet";
}

export function ArticleAutomationSettingsForm({
  projectId,
  settings,
}: {
  projectId: string;
  settings: ArticleAutomationSettings;
}) {
  const [state, action, pending] = useActionState<
    ArticleAutomationActionState,
    FormData
  >(updateArticleAutomationAction.bind(null, projectId), null);
  const timeZoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeZoneRef.current && !settings.enabled && settings.timeZone === "UTC")
      timeZoneRef.current.value =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }, [settings.enabled, settings.timeZone]);

  return (
    <form action={action} className="space-y-5">
      <ErrorToast message={state?.error} />
      <label className="flex items-start gap-3">
        <input
          className="toggle toggle-primary mt-0.5"
          defaultChecked={settings.enabled}
          name="enabled"
          type="checkbox"
        />
        <span>
          <strong>Publish one article daily</strong>
          <span className="text-base-content/60 block text-sm">
            Uses the strongest available backlog keyword and publishes without
            translations.
          </span>
        </span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="fieldset">
          <span className="fieldset-legend">Local publication time</span>
          <input
            className="input w-full"
            defaultValue={settings.localTime}
            name="localTime"
            required
            type="time"
          />
        </label>
        <label className="fieldset">
          <span className="fieldset-legend">IANA timezone</span>
          <input
            className="input w-full"
            maxLength={100}
            name="timeZone"
            defaultValue={settings.timeZone}
            required
            ref={timeZoneRef}
          />
        </label>
      </div>
      <dl className="text-base-content/65 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt>Next run</dt>
          <dd className="text-base-content">{dateTime(settings.nextRunAt)}</dd>
        </div>
        <div>
          <dt>Last completed</dt>
          <dd className="text-base-content">
            {dateTime(settings.lastCompletedAt)}
          </dd>
        </div>
      </dl>
      {settings.activeArticleId ? (
        <p className="text-sm">
          Resumable article: <code>{settings.activeArticleId}</code> (
          {settings.stage})
        </p>
      ) : null}
      {settings.lastError ? (
        <div className="alert alert-warning text-sm" role="status">
          <span>{settings.lastError}</span>
        </div>
      ) : null}
      <div className="flex justify-end">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Saving…" : "Save automation"}
        </button>
      </div>
    </form>
  );
}
