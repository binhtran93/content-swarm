"use client";

import { useActionState, useMemo, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { marketLabel } from "@/config/supported-locales";
import {
  createKeywordGroupAction,
  dissolveKeywordGroupAction,
  removeSelectedKeywordsAction,
} from "@/features/keywords/backoffice/keyword-actions.server";
import { KeywordDifficultyBadge } from "@/features/keywords/backoffice/keyword-difficulty-badge";
import type { Keyword, KeywordGroup } from "@/features/keywords/model/keyword";

type BacklogSortField = "volume" | "difficulty";
type SortDirection = "asc" | "desc";

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
  const [minimumVolumeFilter, setMinimumVolumeFilter] = useState("");
  const [maximumDifficultyFilter, setMaximumDifficultyFilter] = useState("");
  const [sortField, setSortField] = useState<BacklogSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [viewingGroupId, setViewingGroupId] = useState<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [confirmingDissolve, setConfirmingDissolve] = useState(false);
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
  const backlogGroups = groups.filter((group) =>
    group.memberKeywordIds.every((id) => !byId.get(id)?.articleId),
  );
  const viewingGroup = viewingGroupId
    ? (groupsById.get(viewingGroupId) ?? null)
    : null;
  const backlogRows = keywords.filter((keyword) => {
    if (keyword.articleId) return false;
    if (!keyword.groupId) return true;
    const group = groupsById.get(keyword.groupId);
    if (!group) return true;
    return (
      backlogGroups.some((item) => item.groupId === group.groupId) &&
      group.primaryKeywordId === keyword.keywordId
    );
  });
  const minimumVolume = minimumVolumeFilter
    ? Number(minimumVolumeFilter)
    : null;
  const maximumDifficulty = maximumDifficultyFilter
    ? Number(maximumDifficultyFilter)
    : null;
  const filteredKeywords = backlogRows.filter((keyword) => {
    if (
      search &&
      !keyword.normalizedKeyword.includes(search.toLocaleLowerCase())
    )
      return false;
    if (market && `${keyword.countryCode}:${keyword.languageCode}` !== market)
      return false;
    if (
      minimumVolume !== null &&
      (keyword.searchVolume === null || keyword.searchVolume < minimumVolume)
    )
      return false;
    if (
      maximumDifficulty !== null &&
      (keyword.difficulty === null || keyword.difficulty > maximumDifficulty)
    )
      return false;
    return true;
  });
  const visibleKeywords = sortField
    ? [...filteredKeywords].sort((left, right) => {
        const leftValue =
          sortField === "volume" ? left.searchVolume : left.difficulty;
        const rightValue =
          sortField === "volume" ? right.searchVolume : right.difficulty;
        if (leftValue === null && rightValue === null) return 0;
        if (leftValue === null) return 1;
        if (rightValue === null) return -1;
        return sortDirection === "asc"
          ? leftValue - rightValue
          : rightValue - leftValue;
      })
    : filteredKeywords;
  const markets = [
    ...new Map(
      backlogRows.map((keyword) => {
        const value = `${keyword.countryCode}:${keyword.languageCode}`;

        return [
          value,
          {
            value,
            label: marketLabel(keyword.countryCode, keyword.languageCode),
          },
        ];
      }),
    ).values(),
  ].sort((left, right) => left.label.localeCompare(right.label));
  const visibleSelectableIds = visibleKeywords.map(
    (keyword) => keyword.keywordId,
  );
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

  function sortBacklog(field: BacklogSortField) {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection(field === "volume" ? "desc" : "asc");
  }

  function sortIndicator(field: BacklogSortField) {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  }

  return (
    <div className="space-y-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-6 lg:space-y-0 lg:overflow-hidden">
      <ErrorToast message={state?.error ?? removeState?.error} />
      <form
        action={action}
        className="card card-border bg-base-100 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="card-body flex min-h-0 flex-1 flex-col p-0">
          <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="card-title">Backlog</h2>
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
                  onClick={() => setConfirmingRemoval(true)}
                  type="button"
                >
                  {removePending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : null}
                  {removePending ? "Removing…" : "Remove from backlog"}
                </button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-3 px-5 pb-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="input flex w-full items-center gap-2">
              <svg
                aria-hidden="true"
                className="size-5 shrink-0 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m16.5 16.5 4 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
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
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              aria-label="Minimum backlog search volume"
              className="input w-full"
              min="0"
              onChange={(event) => setMinimumVolumeFilter(event.target.value)}
              placeholder="Minimum volume"
              type="number"
              value={minimumVolumeFilter}
            />
            <input
              aria-label="Maximum backlog keyword difficulty"
              className="input w-full"
              max="100"
              min="0"
              onChange={(event) =>
                setMaximumDifficultyFilter(event.target.value)
              }
              placeholder="Maximum difficulty"
              type="number"
              value={maximumDifficultyFilter}
            />
          </div>
          <input name="projectId" type="hidden" value={projectId} />
          {selected.map((id) => (
            <input key={id} name="memberIds" type="hidden" value={id} />
          ))}
          {backlogRows.length === 0 ? (
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
                    <th
                      aria-sort={
                        sortField === "volume"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <button
                        aria-label="Sort backlog by volume"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => sortBacklog("volume")}
                        type="button"
                      >
                        Volume
                        <span aria-hidden="true" className="text-xs">
                          {sortIndicator("volume")}
                        </span>
                      </button>
                    </th>
                    <th
                      aria-sort={
                        sortField === "difficulty"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <button
                        aria-label="Sort backlog by difficulty"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => sortBacklog("difficulty")}
                        type="button"
                      >
                        Difficulty
                        <span aria-hidden="true" className="text-xs">
                          {sortIndicator("difficulty")}
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleKeywords.map((keyword) => {
                    return (
                      <tr key={keyword.keywordId}>
                        <td>
                          <input
                            aria-label={`Select ${keyword.keyword}`}
                            checked={selected.includes(keyword.keywordId)}
                            className="checkbox checkbox-sm"
                            onChange={(event) =>
                              toggle(keyword.keywordId, event.target.checked)
                            }
                            type="checkbox"
                          />
                        </td>
                        <td>
                          {keyword.groupId ? (
                            <button
                              aria-label={`View group for ${keyword.keyword}`}
                              className="link link-hover text-left font-medium"
                              onClick={() => setViewingGroupId(keyword.groupId)}
                              type="button"
                            >
                              {keyword.keyword}
                            </button>
                          ) : (
                            <span className="font-medium">
                              {keyword.keyword}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-ghost">
                            {marketLabel(
                              keyword.countryCode,
                              keyword.languageCode,
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="tabular-nums">
                            {keyword.searchVolume?.toLocaleString() ?? "—"}
                          </span>
                        </td>
                        <td>
                          <KeywordDifficultyBadge score={keyword.difficulty} />
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
      {viewingGroup && !confirmingDissolve ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {byId.get(viewingGroup.primaryKeywordId)?.keyword ??
                    "Keyword group"}
                </h2>
                <p className="text-base-content/60 text-sm">
                  {viewingGroup.memberKeywordIds.length} keywords
                </p>
              </div>
              <button
                aria-label="Close keyword group"
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setViewingGroupId(null)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="border-base-300 rounded-box mt-4 max-h-[60dvh] overflow-auto border">
              <table className="table">
                <thead className="bg-base-100 sticky top-0 z-1">
                  <tr>
                    <th>Keyword</th>
                    <th>Volume</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingGroup.memberKeywordIds.map((id) => {
                    const keyword = byId.get(id);
                    return keyword ? (
                      <tr key={id}>
                        <td>
                          <span className="font-medium">{keyword.keyword}</span>
                          {id === viewingGroup.primaryKeywordId ? (
                            <span className="badge badge-primary badge-soft ml-2">
                              Primary
                            </span>
                          ) : null}
                        </td>
                        <td className="tabular-nums">
                          {keyword.searchVolume?.toLocaleString() ?? "—"}
                        </td>
                        <td>
                          <KeywordDifficultyBadge score={keyword.difficulty} />
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-error btn-outline"
                onClick={() => setConfirmingDissolve(true)}
                type="button"
              >
                Dissolve group
              </button>
              <button
                className="btn"
                onClick={() => setViewingGroupId(null)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
          <button
            aria-label="Close keyword group"
            className="modal-backdrop"
            onClick={() => setViewingGroupId(null)}
            type="button"
          >
            close
          </button>
        </div>
      ) : null}
      {viewingGroup && confirmingDissolve ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h2 className="text-lg font-semibold">Dissolve this group?</h2>
            <p className="text-base-content/70 mt-3">
              All {viewingGroup.memberKeywordIds.length} keywords will return to
              the backlog as standalone keywords. No keyword will be deleted.
            </p>
            <form action={dissolveKeywordGroupAction} className="modal-action">
              <input name="projectId" type="hidden" value={projectId} />
              <input
                name="groupId"
                type="hidden"
                value={viewingGroup.groupId}
              />
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmingDissolve(false)}
                type="button"
              >
                Cancel
              </button>
              <button className="btn btn-error" type="submit">
                Dissolve group
              </button>
            </form>
          </div>
          <button
            aria-label="Cancel group dissolution"
            className="modal-backdrop"
            onClick={() => setConfirmingDissolve(false)}
            type="button"
          >
            close
          </button>
        </div>
      ) : null}
      {confirmingRemoval ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h2 className="text-lg font-semibold">
              Remove selected from backlog?
            </h2>
            <p className="text-base-content/70 mt-3">
              This will remove {selected.length} selected backlog row
              {selected.length === 1 ? "" : "s"}. Selected groups include all of
              their member keywords. Saved discovery results are not affected.
            </p>
            <form action={removeAction} className="modal-action">
              <input name="projectId" type="hidden" value={projectId} />
              {selected.map((id) => (
                <input key={id} name="memberIds" type="hidden" value={id} />
              ))}
              <button
                className="btn btn-ghost"
                disabled={removePending}
                onClick={() => setConfirmingRemoval(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                disabled={removePending}
                type="submit"
              >
                {removePending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : null}
                {removePending ? "Removing…" : "Remove from backlog"}
              </button>
            </form>
          </div>
          <button
            aria-label="Cancel backlog removal"
            className="modal-backdrop"
            onClick={() => setConfirmingRemoval(false)}
            type="button"
          >
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}
