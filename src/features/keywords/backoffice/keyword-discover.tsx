"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import {
  defaultLocale,
  findSupportedMarket,
  marketLabel,
  supportedLocales,
} from "@/config/supported-locales";
import {
  addDiscoveryResultsAction,
  removeDiscoveryAction,
  runDiscoveryAction,
} from "@/features/keywords/backoffice/discovery-actions.server";
import { KeywordDifficultyBadge } from "@/features/keywords/backoffice/keyword-difficulty-badge";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";

type ResultSortField = "volume" | "difficulty" | "relevanceOrder";
type SortDirection = "asc" | "desc";

function RequestFields({ discovery }: { discovery?: KeywordDiscovery | null }) {
  const [method, setMethod] = useState(discovery?.method ?? "keyword_ideas");
  const selectedLocale = discovery
    ? findSupportedMarket(discovery.countryCode, discovery.languageCode)?.locale
    : undefined;

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Method</legend>
        <select
          className="select w-full"
          name="method"
          value={method}
          onChange={(event) =>
            setMethod(
              event.target.value as
                "keyword_ideas" | "related_keywords" | "competitor_website",
            )
          }
        >
          <option value="keyword_ideas">Keyword ideas</option>
          <option value="related_keywords">Related keywords</option>
          <option value="competitor_website">Competitor website</option>
        </select>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Result limit</legend>
        <select
          className="select w-full"
          defaultValue={discovery?.limit ?? 50}
          name="limit"
        >
          {[50, 100, 250, 500].map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset sm:col-span-2">
        <legend className="fieldset-legend">
          {method === "keyword_ideas"
            ? "Seed keywords"
            : method === "related_keywords"
              ? "Seed keyword"
              : "Competitor domain"}
        </legend>
        {method === "keyword_ideas" ? (
          <>
            <textarea
              className="textarea min-h-28 w-full leading-6"
              defaultValue={discovery?.input}
              name="input"
              placeholder={
                "subscription tracker\ncancel subscriptions\nsubscription manager"
              }
              required
            />
            <p className="fieldset-label">
              One seed keyword per line, up to 200. Duplicate lines are ignored.
            </p>
          </>
        ) : (
          <input
            className="input w-full"
            defaultValue={discovery?.input}
            name="input"
            placeholder={
              method === "related_keywords"
                ? "subscription tracker"
                : "competitor.com"
            }
            required
          />
        )}
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Market</legend>
        <select
          aria-label="Market"
          className="select w-full"
          defaultValue={selectedLocale ?? defaultLocale}
          name="locale"
          required
        >
          {supportedLocales.map((locale) => (
            <option key={locale.locale} value={locale.locale}>
              {locale.label}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Minimum volume</legend>
        <input
          className="input w-full"
          defaultValue={discovery?.minimumVolume ?? ""}
          min="0"
          name="minimumVolume"
          type="number"
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Maximum difficulty</legend>
        <input
          className="input w-full"
          defaultValue={discovery?.maximumDifficulty ?? ""}
          max="100"
          min="0"
          name="maximumDifficulty"
          type="number"
        />
      </fieldset>
    </>
  );
}

export function KeywordDiscover({
  projectId,
  discoveries,
  selected,
  existingNormalizedKeywords,
}: {
  projectId: string;
  discoveries: KeywordDiscovery[];
  selected: KeywordDiscovery | null;
  existingNormalizedKeywords: string[];
}) {
  const [state, action, pending] = useActionState(runDiscoveryAction, null);
  const [addState, addAction, addPending] = useActionState(
    addDiscoveryResultsAction,
    null,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeDiscoveryAction,
    null,
  );
  const [removingDiscovery, setRemovingDiscovery] =
    useState<KeywordDiscovery | null>(null);
  const [resultSearch, setResultSearch] = useState("");
  const [minimumVolumeFilter, setMinimumVolumeFilter] = useState("");
  const [maximumDifficultyFilter, setMaximumDifficultyFilter] = useState("");
  const [resultSortField, setResultSortField] =
    useState<ResultSortField | null>(null);
  const [resultSortDirection, setResultSortDirection] =
    useState<SortDirection>("asc");
  const [resultSelections, setResultSelections] = useState<
    Record<string, string[]>
  >({});
  const existing = new Set(existingNormalizedKeywords);
  const availableResults =
    selected?.results.filter(
      (result) =>
        !existing.has(
          result.keyword.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US"),
        ),
    ) ?? [];
  const normalizedResultSearch = resultSearch.trim().toLocaleLowerCase("en-US");
  const minimumVolume = minimumVolumeFilter
    ? Number(minimumVolumeFilter)
    : null;
  const maximumDifficulty = maximumDifficultyFilter
    ? Number(maximumDifficultyFilter)
    : null;
  const filteredResults = availableResults.filter(
    (result) =>
      (!normalizedResultSearch ||
        result.keyword
          .toLocaleLowerCase("en-US")
          .includes(normalizedResultSearch)) &&
      (minimumVolume === null ||
        (result.searchVolume !== null &&
          result.searchVolume !== undefined &&
          result.searchVolume >= minimumVolume)) &&
      (maximumDifficulty === null ||
        (result.difficulty !== null &&
          result.difficulty !== undefined &&
          result.difficulty <= maximumDifficulty)),
  );
  const availableKeywordValues = new Set(
    availableResults.map((result) => result.keyword),
  );
  const selectedKeywordValues = selected
    ? (resultSelections[selected.discoveryId] ?? []).filter((keyword) =>
        availableKeywordValues.has(keyword),
      )
    : [];
  const selectedKeywordSet = new Set(selectedKeywordValues);
  const allVisibleSelected =
    filteredResults.length > 0 &&
    filteredResults.every((result) => selectedKeywordSet.has(result.keyword));
  const someVisibleSelected = filteredResults.some((result) =>
    selectedKeywordSet.has(result.keyword),
  );
  const updateSelectedKeywords = (keywords: string[]) => {
    if (!selected) return;
    setResultSelections((current) => ({
      ...current,
      [selected.discoveryId]: keywords,
    }));
  };
  const toggleAllVisible = () => {
    const next = new Set(selectedKeywordValues);
    filteredResults.forEach((result) => {
      if (allVisibleSelected) next.delete(result.keyword);
      else next.add(result.keyword);
    });
    updateSelectedKeywords([...next]);
  };
  const sortedResults = resultSortField
    ? [...filteredResults].sort((left, right) => {
        const value = (result: (typeof filteredResults)[number]) => {
          if (resultSortField === "volume") return result.searchVolume;
          if (resultSortField === "difficulty") return result.difficulty;
          return result.relevanceOrder;
        };
        const leftValue = value(left);
        const rightValue = value(right);
        if (
          (leftValue === null || leftValue === undefined) &&
          (rightValue === null || rightValue === undefined)
        )
          return 0;
        if (leftValue === null || leftValue === undefined) return 1;
        if (rightValue === null || rightValue === undefined) return -1;
        return resultSortDirection === "asc"
          ? leftValue - rightValue
          : rightValue - leftValue;
      })
    : filteredResults;
  const sortResults = (field: ResultSortField) => {
    if (resultSortField === field) {
      setResultSortDirection((direction) =>
        direction === "asc" ? "desc" : "asc",
      );
      return;
    }
    setResultSortField(field);
    setResultSortDirection(field === "volume" ? "desc" : "asc");
  };
  const sortIndicator = (field: ResultSortField) =>
    resultSortField === field
      ? resultSortDirection === "asc"
        ? "↑"
        : "↓"
      : "↕";
  const resultSelectionFormId = selected
    ? `discovery-results-${selected.discoveryId}`
    : undefined;
  const discoveryLabel = (discovery: KeywordDiscovery) => {
    const inputs = discovery.input.split(/\r?\n/).filter(Boolean);
    return inputs.length > 1
      ? `${inputs[0]} +${inputs.length - 1} more`
      : discovery.input;
  };

  return (
    <div className="grid min-h-0 flex-1 items-start gap-6 lg:h-full lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)]">
      <ErrorToast
        message={state?.error ?? addState?.error ?? removeState?.error}
      />
      <div className="flex min-h-0 flex-col gap-6 lg:h-full">
        <form action={action}>
          <details
            className="collapse-arrow bg-base-100 border-base-300 collapse border"
            open={state?.error ? true : undefined}
          >
            <summary className="collapse-title flex items-center justify-between gap-4 px-5 py-4">
              <h2 className="font-medium">Discover keywords</h2>
            </summary>
            <div className="collapse-content border-base-300 border-t px-5 pb-5">
              <input name="projectId" type="hidden" value={projectId} />
              <div className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
                <RequestFields discovery={selected} />
              </div>
              <div className="border-base-300 mt-5 flex items-center justify-between gap-4 border-t pt-4">
                <p className="text-base-content/55 text-xs">
                  Nothing runs until you submit this form.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : null}
                  {pending ? "Getting keywords…" : "Get keywords"}
                </button>
              </div>
            </div>
          </details>
        </form>

        {selected ? (
          <section className="card card-border bg-base-100 min-h-0 flex-1 overflow-hidden">
            <div className="card-body flex h-full min-h-0 flex-col p-0">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
                  <h2 className="card-title">
                    Results for “{discoveryLabel(selected)}”
                  </h2>
                </div>
                {selectedKeywordValues.length > 0 &&
                filteredResults.length > 0 ? (
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={addPending}
                    form={resultSelectionFormId}
                    type="submit"
                  >
                    {addPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : null}
                    {addPending ? "Adding…" : "Add to backlog"}
                  </button>
                ) : null}
              </div>
              {availableResults.length === 0 ? (
                <div className="border-base-300 border-t px-5 py-12 text-center">
                  <p className="font-medium">
                    {selected.results.length === 0
                      ? "This successful discovery returned no results."
                      : "All discovered keywords are already in the backlog."}
                  </p>
                  {selected.results.length === 0 ? (
                    <p className="text-base-content/60 mt-1 text-sm">
                      It remains saved and will be reused.
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="border-base-300 grid gap-3 border-y px-5 py-3 sm:grid-cols-3">
                    <fieldset className="fieldset p-0">
                      <legend className="fieldset-legend text-xs">
                        Search
                      </legend>
                      <input
                        aria-label="Search discovery results"
                        className="input input-sm w-full"
                        onChange={(event) =>
                          setResultSearch(event.target.value)
                        }
                        placeholder="Search keywords"
                        type="search"
                        value={resultSearch}
                      />
                    </fieldset>
                    <fieldset className="fieldset p-0">
                      <legend className="fieldset-legend text-xs">
                        Minimum volume
                      </legend>
                      <input
                        aria-label="Minimum search volume"
                        className="input input-sm w-full"
                        min="0"
                        onChange={(event) =>
                          setMinimumVolumeFilter(event.target.value)
                        }
                        placeholder="Any volume"
                        type="number"
                        value={minimumVolumeFilter}
                      />
                    </fieldset>
                    <fieldset className="fieldset p-0">
                      <legend className="fieldset-legend text-xs">
                        Maximum difficulty
                      </legend>
                      <input
                        aria-label="Maximum keyword difficulty"
                        className="input input-sm w-full"
                        max="100"
                        min="0"
                        onChange={(event) =>
                          setMaximumDifficultyFilter(event.target.value)
                        }
                        placeholder="Any difficulty"
                        type="number"
                        value={maximumDifficultyFilter}
                      />
                    </fieldset>
                  </div>
                  {filteredResults.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <p className="font-medium">
                        No keywords match the filters.
                      </p>
                      <p className="text-base-content/60 mt-1 text-sm">
                        Adjust or clear a filter to see more results.
                      </p>
                    </div>
                  ) : (
                    <form
                      action={addAction}
                      className="flex min-h-0 flex-1 flex-col"
                      id={resultSelectionFormId}
                    >
                      <input name="projectId" type="hidden" value={projectId} />
                      <input
                        name="discoveryId"
                        type="hidden"
                        value={selected.discoveryId}
                      />
                      {selectedKeywordValues.map((keyword) => (
                        <input
                          key={keyword}
                          name="keywords"
                          type="hidden"
                          value={keyword}
                        />
                      ))}
                      <div className="min-h-0 flex-1 overflow-auto">
                        <table className="keyword-results-table table min-w-[48rem]">
                          <thead className="bg-base-100 sticky top-0 z-1">
                            <tr>
                              <th>
                                <input
                                  aria-label="Select all visible keywords"
                                  checked={allVisibleSelected}
                                  className="checkbox checkbox-sm"
                                  onChange={toggleAllVisible}
                                  ref={(checkbox) => {
                                    if (checkbox)
                                      checkbox.indeterminate =
                                        someVisibleSelected &&
                                        !allVisibleSelected;
                                  }}
                                  type="checkbox"
                                />
                              </th>
                              <th>Keyword</th>
                              <th
                                aria-sort={
                                  resultSortField === "volume"
                                    ? resultSortDirection === "asc"
                                      ? "ascending"
                                      : "descending"
                                    : "none"
                                }
                              >
                                <button
                                  aria-label="Sort by volume"
                                  className="inline-flex items-center gap-1.5"
                                  onClick={() => sortResults("volume")}
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
                                  resultSortField === "difficulty"
                                    ? resultSortDirection === "asc"
                                      ? "ascending"
                                      : "descending"
                                    : "none"
                                }
                              >
                                <button
                                  aria-label="Sort by difficulty"
                                  className="inline-flex items-center gap-1.5"
                                  onClick={() => sortResults("difficulty")}
                                  type="button"
                                >
                                  Difficulty
                                  <span aria-hidden="true" className="text-xs">
                                    {sortIndicator("difficulty")}
                                  </span>
                                </button>
                              </th>
                              <th
                                className="text-center"
                                aria-sort={
                                  resultSortField === "relevanceOrder"
                                    ? resultSortDirection === "asc"
                                      ? "ascending"
                                      : "descending"
                                    : "none"
                                }
                              >
                                <button
                                  aria-label="Sort by relevance order"
                                  className="inline-flex items-center justify-center gap-1.5"
                                  onClick={() => sortResults("relevanceOrder")}
                                  type="button"
                                >
                                  Relevance
                                  <span aria-hidden="true" className="text-xs">
                                    {sortIndicator("relevanceOrder")}
                                  </span>
                                </button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedResults.map((result, index) => {
                              return (
                                <tr key={`${result.keyword}:${index}`}>
                                  <td>
                                    <input
                                      aria-label={`Select ${result.keyword}`}
                                      checked={selectedKeywordSet.has(
                                        result.keyword,
                                      )}
                                      className="checkbox checkbox-sm"
                                      onChange={(event) => {
                                        const next = new Set(
                                          selectedKeywordValues,
                                        );
                                        if (event.target.checked)
                                          next.add(result.keyword);
                                        else next.delete(result.keyword);
                                        updateSelectedKeywords([...next]);
                                      }}
                                      type="checkbox"
                                    />
                                  </td>
                                  <td>{result.keyword}</td>
                                  <td>
                                    {result.searchVolume?.toLocaleString() ??
                                      "—"}
                                  </td>
                                  <td>
                                    <KeywordDifficultyBadge
                                      score={result.difficulty ?? null}
                                    />
                                  </td>
                                  <td className="text-center tabular-nums">
                                    {result.relevanceOrder ?? "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="card card-border bg-base-100 max-h-full overflow-hidden">
        <div className="card-body flex min-h-0 flex-col">
          <h2 className="card-title text-base">Saved discoveries</h2>
          {discoveries.length === 0 ? (
            <p className="text-base-content/60 text-sm">
              No provider calls have been saved.
            </p>
          ) : (
            <ul className="menu -mx-2 min-h-0 overflow-y-auto">
              {discoveries.map((discovery) => (
                <li
                  className="flex-row items-center gap-1"
                  key={discovery.discoveryId}
                >
                  <Link
                    className={`min-w-0 flex-1 ${
                      selected?.discoveryId === discovery.discoveryId
                        ? "active"
                        : ""
                    }`}
                    href={`/admin/projects/${projectId}/keywords?view=discover&discovery=${discovery.discoveryId}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {discoveryLabel(discovery)}
                      </span>
                      <span className="text-xs opacity-60">
                        {marketLabel(
                          discovery.countryCode,
                          discovery.languageCode,
                        )}{" "}
                        · {discovery.method.replaceAll("_", " ")} ·{" "}
                        {discovery.results.length} results
                      </span>
                    </span>
                  </Link>
                  <button
                    aria-label={`Remove ${discoveryLabel(discovery)}`}
                    className="btn btn-ghost btn-square btn-sm text-base-content/55 hover:text-error shrink-0"
                    onClick={() => setRemovingDiscovery(discovery)}
                    title="Remove saved discovery"
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      {removingDiscovery ? (
        <div aria-modal="true" className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h2 className="text-lg font-semibold">
              Remove {discoveryLabel(removingDiscovery)}?
            </h2>
            <p className="text-base-content/70 mt-3">
              This permanently removes the saved discovery and its results.
              Keywords already added to the backlog are not affected.
            </p>
            <form action={removeAction} className="modal-action">
              <input name="projectId" type="hidden" value={projectId} />
              <input
                name="discoveryId"
                type="hidden"
                value={removingDiscovery.discoveryId}
              />
              <button
                className="btn btn-ghost"
                disabled={removePending}
                onClick={() => setRemovingDiscovery(null)}
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
                {removePending ? "Removing…" : "Remove discovery"}
              </button>
            </form>
          </div>
          <button
            aria-label="Cancel discovery removal"
            className="modal-backdrop"
            onClick={() => setRemovingDiscovery(null)}
            type="button"
          >
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}
