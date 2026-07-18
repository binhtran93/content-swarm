"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  addDiscoveryResultsAction,
  rerunDiscoveryAction,
  runDiscoveryAction,
} from "@/features/keywords/backoffice/discovery-actions.server";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import type { DiscoveryLocation } from "@/features/keywords/model/discovery-location";

function RequestFields({
  discovery,
  locations,
}: {
  discovery?: KeywordDiscovery | null;
  locations: DiscoveryLocation[];
}) {
  const [method, setMethod] = useState(discovery?.method ?? "keyword_ideas");
  const defaultCountry =
    locations.find(
      (location) => location.countryCode === discovery?.countryCode,
    )?.countryCode ??
    locations.find((location) => location.countryCode === "US")?.countryCode ??
    locations[0]?.countryCode ??
    "";
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const location = locations.find((item) => item.countryCode === countryCode);
  const defaultLanguage =
    location?.languages.find(
      (language) => language.languageCode === discovery?.languageCode,
    )?.languageCode ??
    location?.languages.find((language) => language.languageCode === "en")
      ?.languageCode ??
    location?.languages[0]?.languageCode ??
    "";
  const [languageCode, setLanguageCode] = useState(defaultLanguage);

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
        <legend className="fieldset-legend">Country</legend>
        <select
          className="select w-full"
          name="countryCode"
          required
          value={countryCode}
          onChange={(event) => {
            const nextCountry = event.target.value;
            const nextLocation = locations.find(
              (item) => item.countryCode === nextCountry,
            );
            setCountryCode(nextCountry);
            setLanguageCode(
              nextLocation?.languages.find(
                (language) => language.languageCode === "en",
              )?.languageCode ??
                nextLocation?.languages[0]?.languageCode ??
                "",
            );
          }}
        >
          {locations.map((item) => (
            <option key={item.countryCode} value={item.countryCode}>
              {item.locationName} ({item.countryCode})
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Language</legend>
        <select
          className="select w-full"
          name="languageCode"
          required
          value={languageCode}
          onChange={(event) => setLanguageCode(event.target.value)}
        >
          {location?.languages.map((language) => (
            <option key={language.languageCode} value={language.languageCode}>
              {language.languageName} ({language.languageCode})
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
  locations,
}: {
  projectId: string;
  discoveries: KeywordDiscovery[];
  selected: KeywordDiscovery | null;
  existingNormalizedKeywords: string[];
  locations: DiscoveryLocation[];
}) {
  const [state, action, pending] = useActionState(runDiscoveryAction, null);
  const [rerunState, rerunAction, rerunPending] = useActionState(
    rerunDiscoveryAction,
    null,
  );
  const existing = new Set(existingNormalizedKeywords);
  const availableResults =
    selected?.results.filter(
      (result) =>
        !existing.has(
          result.keyword.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US"),
        ),
    ) ?? [];
  const discoveryLabel = (discovery: KeywordDiscovery) => {
    const inputs = discovery.input.split(/\r?\n/).filter(Boolean);
    return inputs.length > 1
      ? `${inputs[0]} +${inputs.length - 1} more`
      : discovery.input;
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)]">
      <div className="space-y-6">
        <form action={action} className="card card-border bg-base-100">
          <div className="card-body">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="card-title">Discover keywords</h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  Configure a web keyword request. Matching saved results are
                  reused.
                </p>
              </div>
              <div className="badge badge-warning badge-soft badge-sm">
                Provider call
              </div>
            </div>
            {state?.error ? (
              <div className="alert alert-error mt-4" role="alert">
                {state.error}
              </div>
            ) : null}
            <input name="projectId" type="hidden" value={projectId} />
            {locations.length === 0 ? (
              <div className="alert alert-warning mt-4" role="alert">
                Country and language options could not be loaded from
                DataForSEO.
              </div>
            ) : null}
            <div className="mt-5 grid gap-x-4 gap-y-3 sm:grid-cols-2">
              <RequestFields discovery={selected} locations={locations} />
            </div>
            <div className="border-base-300 mt-5 flex items-center justify-between gap-4 border-t pt-4">
              <p className="text-base-content/55 text-xs">
                Nothing runs until you submit this form.
              </p>
              <button
                className="btn btn-primary btn-sm"
                disabled={pending || locations.length === 0}
                type="submit"
              >
                {pending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : null}
                {pending ? "Getting keywords…" : "Get keywords"}
              </button>
            </div>
          </div>
        </form>

        {selected ? (
          <section className="card card-border bg-base-100">
            <div className="card-body p-0">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
                  <h2 className="card-title">
                    Results for “{discoveryLabel(selected)}”
                  </h2>
                  <p className="text-base-content/60 text-sm">
                    {selected.results.length} saved · {availableResults.length}{" "}
                    not yet in backlog
                  </p>
                </div>
                <form action={rerunAction}>
                  <input name="projectId" type="hidden" value={projectId} />
                  <input name="method" type="hidden" value={selected.method} />
                  <input name="input" type="hidden" value={selected.input} />
                  <input
                    name="countryCode"
                    type="hidden"
                    value={selected.countryCode}
                  />
                  <input
                    name="languageCode"
                    type="hidden"
                    value={selected.languageCode}
                  />
                  <input name="limit" type="hidden" value={selected.limit} />
                  <input
                    name="minimumVolume"
                    type="hidden"
                    value={selected.minimumVolume ?? ""}
                  />
                  <input
                    name="maximumDifficulty"
                    type="hidden"
                    value={selected.maximumDifficulty ?? ""}
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={rerunPending}
                    type="submit"
                  >
                    {rerunPending ? "Running paid call…" : "Run again (paid)"}
                  </button>
                </form>
              </div>
              {rerunState?.error ? (
                <div className="alert alert-error mx-5 mb-3 w-auto">
                  {rerunState.error}
                </div>
              ) : null}
              {selected.results.length === 0 ? (
                <div className="border-base-300 border-t px-5 py-12 text-center">
                  <p className="font-medium">
                    This successful discovery returned no results.
                  </p>
                  <p className="text-base-content/60 mt-1 text-sm">
                    It remains saved and will be reused.
                  </p>
                </div>
              ) : (
                <form action={addDiscoveryResultsAction}>
                  <input name="projectId" type="hidden" value={projectId} />
                  <input
                    name="discoveryId"
                    type="hidden"
                    value={selected.discoveryId}
                  />
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <span className="sr-only">Select</span>
                          </th>
                          <th>Keyword</th>
                          <th>Volume</th>
                          <th>Difficulty</th>
                          <th>Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.results.map((result, index) => {
                          const normalized = result.keyword
                            .trim()
                            .replace(/\s+/g, " ")
                            .toLocaleLowerCase("en-US");
                          const alreadyAdded = existing.has(normalized);
                          return (
                            <tr
                              className={alreadyAdded ? "opacity-50" : ""}
                              key={`${result.keyword}:${index}`}
                            >
                              <td>
                                <input
                                  aria-label={`Select ${result.keyword}`}
                                  className="checkbox checkbox-sm"
                                  disabled={alreadyAdded}
                                  name="keywords"
                                  type="checkbox"
                                  value={result.keyword}
                                />
                              </td>
                              <td>
                                {result.keyword}
                                {alreadyAdded ? (
                                  <span className="badge badge-ghost ml-2">
                                    In backlog
                                  </span>
                                ) : null}
                              </td>
                              <td>
                                {result.searchVolume?.toLocaleString() ?? "—"}
                              </td>
                              <td>{result.difficulty ?? "—"}</td>
                              <td>{result.rank ?? "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-base-300 flex justify-end border-t p-4">
                    <button
                      className="btn btn-primary"
                      disabled={availableResults.length === 0}
                      type="submit"
                    >
                      Add selected to backlog
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="card card-border bg-base-100 h-fit">
        <div className="card-body">
          <h2 className="card-title text-base">Saved discoveries</h2>
          {discoveries.length === 0 ? (
            <p className="text-base-content/60 text-sm">
              No provider calls have been saved.
            </p>
          ) : (
            <ul className="menu -mx-2">
              {discoveries.map((discovery) => (
                <li key={discovery.discoveryId}>
                  <Link
                    className={
                      selected?.discoveryId === discovery.discoveryId
                        ? "active"
                        : ""
                    }
                    href={`/admin/projects/${projectId}/keywords?view=discover&discovery=${discovery.discoveryId}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {discoveryLabel(discovery)}
                      </span>
                      <span className="text-xs opacity-60">
                        {discovery.method.replaceAll("_", " ")} ·{" "}
                        {discovery.results.length} results
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
