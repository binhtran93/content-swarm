import Link from "next/link";

import { DeleteArticleControl } from "@/features/articles/backoffice/delete-article-control";
import type { Article } from "@/features/articles/model/article";

export function ArticleList({
  articles,
  projectId,
}: {
  articles: Article[];
  projectId: string;
}) {
  if (!articles.length)
    return (
      <div className="card card-border bg-base-100">
        <div className="card-body items-center gap-3 p-10 text-center">
          <h2 className="mb-2 text-lg font-medium">No articles yet</h2>
          <Link
            className="btn btn-primary btn-sm"
            href={`/admin/projects/${projectId}/articles/new`}
          >
            Create article
          </Link>
        </div>
      </div>
    );
  return (
    <div className="rounded-box border-base-300 bg-base-100 overflow-x-auto border">
      <table className="table">
        <thead>
          <tr>
            <th>Article</th>
            <th>Topic</th>
            <th>Locale</th>
            <th>Status</th>
            <th>Updated</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.articleId}>
              <td>
                <Link
                  className="link link-hover font-medium"
                  href={`/admin/projects/${projectId}/articles/${article.articleId}`}
                >
                  {article.title ?? "Untitled"}
                </Link>
              </td>
              <td>{article.topic ?? "—"}</td>
              <td>{article.locale}</td>
              <td>
                <span
                  className={`badge badge-sm ${article.status === "published" ? "badge-success" : article.status === "archived" ? "badge-neutral" : "badge-ghost"}`}
                >
                  {article.status}
                </span>
              </td>
              <td className="text-sm whitespace-nowrap">
                {new Date(article.updatedAt).toLocaleString()}
              </td>
              <td className="text-right">
                <DeleteArticleControl
                  articleId={article.articleId}
                  articleTitle={article.title ?? "Untitled"}
                  projectId={projectId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
