import Link from "next/link";

import { PageTitle } from "@/backoffice/components/ui/page-title";
import { ArticleKeywordPicker } from "@/features/articles/backoffice/article-keyword-picker";
import { listAvailableArticleTopics } from "@/features/keywords/service/list-available-article-topics.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await getProjectContext(projectId);
  const topics = await listAvailableArticleTopics(projectId);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageTitle title="New article" />
      {topics.length ? (
        <ArticleKeywordPicker projectId={projectId} topics={topics} />
      ) : (
        <div className="alert alert-info">
          <span>No unassigned topics are available.</span>
          <Link
            className="btn btn-sm"
            href={`/admin/projects/${projectId}/keywords?view=backlog`}
          >
            Open keywords
          </Link>
        </div>
      )}
    </div>
  );
}
