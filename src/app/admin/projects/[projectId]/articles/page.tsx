import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { TriggerArticleAutomationButton } from "@/features/articles/automation/trigger-article-automation-button";
import { ArticleList } from "@/features/articles/backoffice/article-list";
import { listArticles } from "@/features/articles/service/list-articles.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export const maxDuration = 1800;

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ automation?: string }>;
}) {
  const { projectId } = await params;
  const { automation } = await searchParams;
  let data: Awaited<ReturnType<typeof load>> | null = null;
  try {
    data = await load(projectId);
  } catch {}
  if (!data)
    return (
      <div className="mx-auto max-w-3xl">
        <PageTitle title="Project unavailable" />
        <Link className="btn btn-sm" href="/admin/projects">
          Back to projects
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageTitle
        title="Articles"
        action={
          <div className="flex items-center gap-2">
            <TriggerArticleAutomationButton projectId={projectId} />
            <Link
              className="btn btn-primary btn-sm"
              href={`/admin/projects/${projectId}/articles/new`}
            >
              New article
            </Link>
          </div>
        }
      />
      {automation ? <AutomationNotice result={automation} /> : null}
      <ArticleList articles={data.articles} projectId={projectId} />
    </div>
  );
}

function AutomationNotice({ result }: { result: string }) {
  const notices: Record<string, { className: string; message: string }> = {
    published: {
      className: "alert-success",
      message: "The automated article was created and published.",
    },
    empty: {
      className: "alert-info",
      message: "There are no eligible backlog keywords to publish.",
    },
    busy: {
      className: "alert-warning",
      message: "Article automation is already running for this project.",
    },
    failed: {
      className: "alert-error",
      message:
        "Article automation failed after its retries. The draft will be resumed next time.",
    },
  };
  const notice = notices[result];
  return notice ? (
    <div className={`alert ${notice.className}`} role="status">
      <span>{notice.message}</span>
    </div>
  ) : null;
}

async function load(projectId: string) {
  const [project, articles] = await Promise.all([
    getProjectContext(projectId),
    listArticles(projectId),
  ]);
  return { project, articles };
}
