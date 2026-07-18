"use client";

import { useActionState, useMemo, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import {
  createKeywordGroupAction,
  dissolveKeywordGroupAction,
  removeSelectedKeywordsAction,
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
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("");
  const [status, setStatus] = useState("");
  const [state, action, pending] = useActionState(
    createKeywordGroupAction,
    null,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeSelectedKeywordsAction,
    null,
  );
  const byId = useMemo(
    () => new Map(keywords.map((keyword) => [keyword.keywordId, keyword])),
    [keywords],
  );
  const groupsById = useMemo(
    () => new Map(groups.map((group) => [group.groupId, group])),
    [groups],
  );
  const backlogRows = keywords.filter((keyword) => {
    if (!keyword.groupId) return true;
    const group = groupsById.get(keyword.groupId);
    return !group || group.primaryKeywordId === keyword.keywordId;
  });
  const available = backlogRows.filter((keyword) => {
    if (keyword.articleId) return false;
    if (!keyword.groupId) return true;
    const group = groupsById.get(keyword.groupId);
    return Boolean(
      group && group.memberKeywordIds.every((id) => !byId.get(id)?.articleId),
    );
  });
  const visibleKeywords = backlogRows.filter((keyword) => {
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
  const visibleSelectableIds = visibleKeywords
    .filter((keyword) =>
      available.some((item) => item.keywordId === keyword.keywordId),
    )
    .map((keyword) => keyword.keywordId);
  const allVisibleSelected =
    visibleSelectableIds.length > 0 &&
    visibleSelectableIds.every((id) => selected.includes(id));
  const someVisibleSelected = visibleSelectableIds.some((id) =>
    selected.includes(id),
  );

  function toggle(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  function toggleAllVisible() {
    setSelected((current) => {
      const next = new Set(current);
      visibleSelectableIds.forEach((id) => {
        if (allVisibleSelected) next.delete(id);
        else next.add(id);
      });
      return [...next];
    });
  }

  return (
    <div className="space-y-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-6 lg:space-y-0 lg:overflow-hidden">
      <ErrorToast message={state?.error ?? removeState?.error} />
      {groups.length ? (
        <section className="shrink-0 space-y-3" aria-labelledby="groups-title">
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

      <form
        action={action}
        className="card card-border bg-base-100 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="card-body flex min-h-0 flex-1 flex-col p-0">
          <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="card-title">Backlog</h2>
              <p className="text-base-content/60 text-sm">
                {keywords.length} accepted keyword
                {keywords.length === 1 ? "" : "s"}
              </p>
            </div>
            {selected.length ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {selected.length >= 2 ? (
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={pending || removePending}
                    type="submit"
                  >
                    {pending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : null}
                    {pending ? "Adding…" : "Add to group"}
                  </button>
                ) : null}
                <button
                  className="btn btn-error btn-outline btn-sm"
                  disabled={pending || removePending}
                  formAction={removeAction}
                  type="submit"
                >
                  {removePending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : null}
                  {removePending ? "Removing…" : "Remove from backlog"}
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
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="table">
                <thead className="bg-base-100 sticky top-0 z-1">
                  <tr>
                    <th className="w-10">
                      <input
                        aria-label="Select all visible backlog keywords"
                        checked={allVisibleSelected}
                        className="checkbox checkbox-sm"
                        disabled={visibleSelectableIds.length === 0}
                        onChange={toggleAllVisible}
                        ref={(checkbox) => {
                          if (checkbox)
                            checkbox.indeterminate =
                              someVisibleSelected && !allVisibleSelected;
                        }}
                        type="checkbox"
                      />
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
    </div>
  );
}
