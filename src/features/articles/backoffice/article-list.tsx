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
      <div className="border-base-300 bg-base-100 w-full rounded-2xl border px-6 py-12 text-center shadow-sm sm:px-12">
        <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-xl">
          <svg
            aria-hidden="true"
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v12a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18V8.5L14 3.5Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M14 3.5v5h5M9 13h6M9 16.5h4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-lg font-semibold">
          Create your first article
        </h2>
        <p className="text-base-content/60 mx-auto mt-2 max-w-sm text-sm leading-6">
          Choose an available topic from your keyword Backlog and start writing.
        </p>
        <div className="mt-6">
          <Link
            className="btn btn-primary"
            href={`/admin/projects/${projectId}/articles/new`}
          >
            New article
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
              <td>{article.topics.join(", ") || "—"}</td>
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
