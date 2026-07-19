import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { ArticleList } from "@/features/articles/backoffice/article-list";
import { listArticles } from "@/features/articles/service/list-articles.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
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
          data.articles.length ? (
            <Link
              className="btn btn-primary btn-sm"
              href={`/admin/projects/${projectId}/articles/new`}
            >
              New article
            </Link>
          ) : undefined
        }
      />
      <ArticleList articles={data.articles} projectId={projectId} />
    </div>
  );
}

async function load(projectId: string) {
  const [project, articles] = await Promise.all([
    getProjectContext(projectId),
    listArticles(projectId),
  ]);
  return { project, articles };
}
