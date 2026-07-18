import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { AddKeywordForm } from "@/features/keywords/backoffice/add-keyword-form";
import { KeywordBacklog } from "@/features/keywords/backoffice/keyword-backlog";
import { KeywordDiscover } from "@/features/keywords/backoffice/keyword-discover";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import type { DiscoveryLocation } from "@/features/keywords/model/discovery-location";
import { getDiscovery } from "@/features/keywords/service/get-discovery.server";
import { listDiscoveryLocations } from "@/features/keywords/provider/fetch-keyword-discovery.server";
import { listDiscoveries } from "@/features/keywords/service/list-discoveries.server";
import { listKeywordGroups } from "@/features/keywords/service/list-keyword-groups.server";
import { listKeywords } from "@/features/keywords/service/list-keywords.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

function value(
  query: Record<string, string | string[] | undefined>,
  key: string,
) {
  const item = query[key];
  return Array.isArray(item) ? item[0] : item;
}

export default async function KeywordsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ projectId }, query] = await Promise.all([params, searchParams]);
  const view = value(query, "view") === "discover" ? "discover" : "backlog";
  let project;
  try {
    project = await getProjectContext(projectId);
  } catch {
    project = null;
  }
  if (!project)
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <PageTitle title="Project unavailable" />
        <div className="alert alert-warning">
          <span>This project is not available for keyword research.</span>
          <Link className="btn btn-sm" href="/admin/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );

  const keywords = await listKeywords(projectId);
  const base = `/admin/projects/${projectId}/keywords`;
  return (
    <div
      className={`mx-auto max-w-7xl ${
        view === "discover"
          ? "space-y-6 lg:flex lg:h-[calc(100dvh-8rem)] lg:flex-col lg:gap-6 lg:space-y-0 lg:overflow-hidden"
          : "space-y-6"
      }`}
    >
      <PageTitle
        action={
          <Link
            className="btn btn-ghost btn-sm"
            href={`/admin/projects/${projectId}/settings`}
          >
            Project settings
          </Link>
        }
        description={``}
        title="Keyword research"
      />
      <div className="tabs tabs-border" role="tablist">
        <Link
          className={`tab ${view === "backlog" ? "tab-active" : ""}`}
          href={`${base}?view=backlog`}
          role="tab"
        >
          Backlog <span className="badge badge-sm ml-1">{keywords.length}</span>
        </Link>
        <Link
          className={`tab ${view === "discover" ? "tab-active" : ""}`}
          href={`${base}?view=discover`}
          role="tab"
        >
          Discover
        </Link>
      </div>
      {value(query, "added") ? (
        <div className="alert alert-success" role="status">
          <span>
            Added {value(query, "added")} keyword(s) to the backlog.
            {value(query, "skipped")
              ? ` Skipped ${value(query, "skipped")} blank or duplicate value(s).`
              : ""}
          </span>
        </div>
      ) : null}
      {value(query, "grouped") === "1" ? (
        <div className="alert alert-success" role="status">
          Keyword group created.
        </div>
      ) : null}
      {value(query, "saved") === "1" ? (
        <div className="alert alert-success" role="status">
          Keyword saved.
        </div>
      ) : null}
      {value(query, "dissolved") === "1" ? (
        <div className="alert alert-success" role="status">
          Keyword group dissolved.
        </div>
      ) : null}
      {view === "backlog" ? (
        <>
          <AddKeywordForm projectId={projectId} />
          <KeywordBacklog
            groups={await listKeywordGroups(projectId)}
            keywords={keywords}
            projectId={projectId}
          />
        </>
      ) : (
        await (async () => {
          const discoveries = await listDiscoveries(projectId);
          let locations: DiscoveryLocation[] = [];
          try {
            locations = await listDiscoveryLocations();
          } catch {
            // Manual backlog remains usable when provider configuration is absent.
          }
          const discoveryId = value(query, "discovery");
          let selected: KeywordDiscovery | null = discoveries[0] ?? null;
          if (discoveryId) {
            try {
              selected = await getDiscovery(projectId, discoveryId);
            } catch {
              selected = null;
            }
          }
          return (
            <KeywordDiscover
              discoveries={discoveries}
              existingNormalizedKeywords={keywords
                .filter(
                  (keyword) =>
                    !selected ||
                    (keyword.countryCode === selected.countryCode &&
                      keyword.languageCode === selected.languageCode),
                )
                .map((keyword) => keyword.normalizedKeyword)}
              projectId={projectId}
              selected={selected}
              locations={locations}
            />
          );
        })()
      )}
    </div>
  );
}
