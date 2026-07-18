"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createKeywordGroupAction,
  dissolveKeywordGroupAction,
  updateKeywordAction,
} from "@/features/keywords/backoffice/keyword-actions.server";
import type { Keyword, KeywordGroup } from "@/features/keywords/model/keyword";

function Metrics({ keyword }: { keyword: Keyword }) {
  return (
    <span className="text-base-content/60 text-xs tabular-nums">
      Vol {keyword.searchVolume?.toLocaleString() ?? "—"} · KD{" "}
      {keyword.difficulty ?? "—"}
    </span>
  );
}

export function KeywordBacklog({
  projectId,
  keywords,
  groups,
}: {
  projectId: string;
  keywords: Keyword[];
  groups: KeywordGroup[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [primaryId, setPrimaryId] = useState("");
  const [editing, setEditing] = useState<Keyword | null>(null);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("");
  const [status, setStatus] = useState("");
  const [state, action, pending] = useActionState(
    createKeywordGroupAction,
    null,
  );
  const [editState, editAction, editPending] = useActionState(
    updateKeywordAction,
    null,
  );
  const byId = useMemo(
    () => new Map(keywords.map((keyword) => [keyword.keywordId, keyword])),
    [keywords],
  );
  const available = keywords.filter(
    (keyword) => !keyword.groupId && !keyword.articleId,
  );
  const visibleKeywords = keywords.filter((keyword) => {
    if (
      search &&
      !keyword.normalizedKeyword.includes(search.toLocaleLowerCase())
    )
      return false;
    if (market && `${keyword.countryCode}:${keyword.languageCode}` !== market)
      return false;
    if (status === "available" && (keyword.articleId || keyword.groupId))
      return false;
    if (status === "grouped" && !keyword.groupId) return false;
    if (status === "assigned" && !keyword.articleId) return false;
    return true;
  });
  const markets = [
    ...new Set(
      keywords.map(
        (keyword) => `${keyword.countryCode}:${keyword.languageCode}`,
      ),
    ),
  ].sort();

  function toggle(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
    if (!checked && primaryId === id) setPrimaryId("");
  }

  return (
    <div className="space-y-6">
      {groups.length ? (
        <section className="space-y-3" aria-labelledby="groups-title">
          <h2 className="text-lg font-semibold" id="groups-title">
            Keyword groups
          </h2>
          {groups.map((group) => {
            const primary = byId.get(group.primaryKeywordId);
            return (
              <details
                className="collapse-arrow bg-base-100 border-base-300 collapse border"
                key={group.groupId}
              >
                <summary className="collapse-title flex flex-wrap items-center gap-2 font-semibold">
                  <span>
                    {group.name ?? primary?.keyword ?? "Keyword group"}
                  </span>
                  <span className="badge badge-outline">
                    {group.memberKeywordIds.length} keywords
                  </span>
                  {primary?.articleId ? (
                    <span className="badge badge-neutral">Assigned</span>
                  ) : null}
                </summary>
                <div className="collapse-content">
                  <ul className="divide-base-300 divide-y">
                    {group.memberKeywordIds.map((id) => {
                      const keyword = byId.get(id);
                      return keyword ? (
                        <li
                          className="flex flex-wrap items-center justify-between gap-2 py-3"
                          key={id}
                        >
                          <span>
                            {keyword.keyword}
                            {id === group.primaryKeywordId ? (
                              <span className="badge badge-primary badge-soft ml-2">
                                Primary
                              </span>
                            ) : null}
                          </span>
                          <Metrics keyword={keyword} />
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {!primary?.articleId ? (
                    <form
                      action={dissolveKeywordGroupAction}
                      className="mt-3 flex justify-end"
                    >
                      <input name="projectId" type="hidden" value={projectId} />
                      <input
                        name="groupId"
                        type="hidden"
                        value={group.groupId}
                      />
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        type="submit"
                      >
                        Dissolve group
                      </button>
                    </form>
                  ) : null}
                </div>
              </details>
            );
          })}
        </section>
      ) : null}

      <form action={action} className="card card-border bg-base-100">
        <div className="card-body p-0">
          <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="card-title">Backlog</h2>
              <p className="text-base-content/60 text-sm">
                {keywords.length} accepted keyword
                {keywords.length === 1 ? "" : "s"}
              </p>
            </div>
            {selected.length >= 2 ? (
              <div className="flex flex-wrap items-end gap-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend py-0 text-xs">
                    Primary keyword
                  </legend>
                  <select
                    className="select select-sm w-full"
                    name="primaryId"
                    required
                    value={primaryId}
                    onChange={(event) => setPrimaryId(event.target.value)}
                  >
                    <option value="">Choose primary</option>
                    {selected.map((id) => (
                      <option key={id} value={id}>
                        {byId.get(id)?.keyword}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={pending || !primaryId}
                  type="submit"
                >
                  {pending ? "Grouping…" : `Group ${selected.length}`}
                </button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-3 px-5 pb-4 sm:grid-cols-3">
            <label className="input flex w-full items-center gap-2">
              <span aria-hidden="true">⌕</span>
              <input
                className="grow"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search backlog"
                type="search"
                value={search}
              />
            </label>
            <select
              aria-label="Filter by market"
              className="select w-full"
              onChange={(event) => setMarket(event.target.value)}
              value={market}
            >
              <option value="">All markets</option>
              {markets.map((item) => (
                <option key={item} value={item}>
                  {item.replace(":", " · ")}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              className="select w-full"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option value="">All statuses</option>
              <option value="available">Available</option>
              <option value="grouped">Grouped</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
          {state?.error ? (
            <div className="alert alert-error mx-5 mb-3 w-auto" role="alert">
              {state.error}
            </div>
          ) : null}
          <input name="projectId" type="hidden" value={projectId} />
          {selected.map((id) => (
            <input key={id} name="memberIds" type="hidden" value={id} />
          ))}
          {keywords.length === 0 ? (
            <div className="border-base-300 border-t px-5 py-12 text-center">
              <p className="font-medium">No keywords yet</p>
              <p className="text-base-content/60 mt-1 text-sm">
                Add known phrases above or use Discover.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10">
                      <span className="sr-only">Select</span>
                    </th>
                    <th>Keyword</th>
                    <th>Market</th>
                    <th>Metrics</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleKeywords.map((keyword) => {
                    const selectable = available.some(
                      (item) => item.keywordId === keyword.keywordId,
                    );
                    return (
                      <tr key={keyword.keywordId}>
                        <td>
                          <input
                            aria-label={`Select ${keyword.keyword}`}
                            checked={selected.includes(keyword.keywordId)}
                            className="checkbox checkbox-sm"
                            disabled={!selectable}
                            onChange={(event) =>
                              toggle(keyword.keywordId, event.target.checked)
                            }
                            type="checkbox"
                          />
                        </td>
                        <td>
                          <span className="font-medium">{keyword.keyword}</span>
                          {keyword.sourceDiscoveryId ? (
                            <span className="text-base-content/45 block text-xs">
                              Discovery
                            </span>
                          ) : null}
                        </td>
                        <td>
                          <span className="badge badge-ghost">
                            {keyword.countryCode} · {keyword.languageCode}
                          </span>
                        </td>
                        <td>
                          <Metrics keyword={keyword} />
                        </td>
                        <td>
                          {keyword.articleId ? (
                            <span className="badge badge-neutral">
                              Assigned
                            </span>
                          ) : keyword.groupId ? (
                            <span className="badge badge-secondary badge-soft">
                              Grouped
                            </span>
                          ) : (
                            <span className="badge badge-success badge-soft">
                              Available
                            </span>
                          )}
                          {!keyword.articleId ? (
                            <button
                              className="btn btn-ghost btn-xs ml-2"
                              onClick={() => setEditing(keyword)}
                              type="button"
                            >
                              Edit
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
      {editing ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h2 className="text-lg font-semibold">Edit keyword</h2>
            <form action={editAction} className="mt-4 space-y-4">
              {editState?.error ? (
                <div className="alert alert-error" role="alert">
                  {editState.error}
                </div>
              ) : null}
              <input name="projectId" type="hidden" value={projectId} />
              <input name="keywordId" type="hidden" value={editing.keywordId} />
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Keyword</legend>
                <input
                  className="input w-full"
                  defaultValue={editing.keyword}
                  name="keyword"
                  required
                />
              </fieldset>
              <div className="grid gap-3 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Country</legend>
                  <input
                    className="input w-full"
                    defaultValue={editing.countryCode}
                    name="countryCode"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Language</legend>
                  <input
                    className="input w-full"
                    defaultValue={editing.languageCode}
                    name="languageCode"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Search volume</legend>
                  <input
                    className="input w-full"
                    defaultValue={editing.searchVolume ?? ""}
                    min="0"
                    name="searchVolume"
                    type="number"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Difficulty</legend>
                  <input
                    className="input w-full"
                    defaultValue={editing.difficulty ?? ""}
                    max="100"
                    min="0"
                    name="difficulty"
                    type="number"
                  />
                </fieldset>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditing(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={editPending}
                  type="submit"
                >
                  {editPending ? "Saving…" : "Save keyword"}
                </button>
              </div>
            </form>
          </div>
          <button
            aria-label="Close edit dialog"
            className="modal-backdrop"
            onClick={() => setEditing(null)}
            type="button"
          >
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}
