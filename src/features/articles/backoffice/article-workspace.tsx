"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import {
  applyContentChangesAction,
  generateContentAction,
  generateExcerptAction,
  generatePlanAction,
  generateTranslationAction,
  reviewContentAction,
  saveContentAction,
  savePlanAction,
  saveSeoAction,
  saveTranslationAction,
} from "@/features/articles/backoffice/article-actions.server";
import { ContentImprovementDialog } from "@/features/articles/backoffice/content-improvement-dialog";
import { ArticleTopicPicker } from "@/features/articles/backoffice/article-topic-picker";
import { MarkdownEditor } from "@/features/articles/backoffice/markdown-editor";
import type { ArticleContentChange } from "@/features/articles/model/article-content-change";
import type { ArticleReference } from "@/features/articles/model/article-reference";
import type { Article } from "@/features/articles/model/article";
import { slugifyArticleTitle } from "@/features/articles/model/article-slug";
import type { Translation } from "@/features/articles/model/translation";

type Step = "plan" | "content" | "seo" | "translations" | "publish";
const steps: { id: Step; label: string }[] = [
  { id: "plan", label: "Article plan" },
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO" },
  { id: "translations", label: "Translations" },
  { id: "publish", label: "Publish" },
];

function Fields({ article }: { article: Article }) {
  return (
    <>
      <input
        name="projectId"
        type="hidden"
        value={(article as Article & { projectId?: string }).projectId}
      />
      <input name="articleId" type="hidden" value={article.articleId} />
    </>
  );
}

export function ReferenceMenu({
  references,
}: {
  references: ArticleReference[];
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      const menu = menuRef.current;

      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      )
        menu.open = false;
    }

    function closeFromEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menuRef.current?.open) {
        menuRef.current.open = false;
        menuRef.current.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);

    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, []);

  if (!references.length) return null;

  return (
    <details className="dropdown dropdown-end" ref={menuRef}>
      <summary className="btn btn-ghost btn-sm">
        Sources {references.length}
      </summary>
      <ul className="menu dropdown-content bg-base-100 border-base-300 z-20 mt-1 max-h-80 w-80 flex-nowrap overflow-y-auto border p-2 shadow-lg">
        {references.map((reference) => (
          <li key={reference.url}>
            <a
              className="block"
              href={reference.url}
              onClick={() => {
                if (menuRef.current) menuRef.current.open = false;
              }}
              rel="noreferrer"
              target="_blank"
            >
              <span className="line-clamp-2 text-sm">{reference.title}</span>
              <span className="text-base-content/55 block truncate text-xs font-normal">
                {new URL(reference.url).hostname.replace(/^www\./, "")}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ActionNotice({ error }: { error?: string; saved?: boolean }) {
  return error ? <ErrorToast message={error} /> : null;
}

function actionData(article: Article, values: Record<string, string> = {}) {
  const data = new FormData();
  data.set(
    "projectId",
    String((article as Article & { projectId?: string }).projectId ?? ""),
  );
  data.set("articleId", article.articleId);
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

function PlanEditor({ article }: { article: Article }) {
  const [plan, setPlan] = useState(article.plan ?? "");
  const [references, setReferences] = useState(article.planReferences);
  const [saveState, saveAction, saving] = useActionState(savePlanAction, null);
  const [generating, startGenerating] = useTransition();
  const [generateError, setGenerateError] = useState<string>();

  function generate() {
    startGenerating(async () => {
      const result = await generatePlanAction(null, actionData(article));
      setGenerateError(result?.error);

      const proposal = result?.proposal;
      if (
        proposal?.plan &&
        (plan === article.plan ||
          window.confirm(
            "Replace your unsaved article plan with the AI proposal?",
          ))
      ) {
        setPlan(proposal.plan);
        setReferences(proposal.references ?? []);
      }
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ActionNotice
        error={saveState?.error ?? generateError}
        saved={saveState?.saved}
      />
      <form action={saveAction} className="flex min-h-0 flex-1 flex-col gap-3">
        <Fields article={article} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-medium">Article plan</h2>
          <div className="flex flex-wrap gap-2">
            <ReferenceMenu references={references} />
            <button
              className="btn btn-primary btn-sm"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving…" : "Save plan"}
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={generating}
              onClick={generate}
              type="button"
            >
              {generating ? "Researching…" : "Generate plan"}
            </button>
          </div>
        </div>
        <input name="plan" type="hidden" value={plan} />
        <input
          name="references"
          type="hidden"
          value={JSON.stringify(references)}
        />
        <MarkdownEditor
          onChange={setPlan}
          placeholder="Define the editorial direction and article structure…"
          value={plan}
        />
      </form>
    </div>
  );
}

function ContentEditor({ article }: { article: Article }) {
  const actionMenuRef = useRef<HTMLDetailsElement>(null);
  const [title, setTitle] = useState(article.title ?? "");
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [content, setContent] = useState(article.content ?? "");
  const [references, setReferences] = useState(article.contentReferences);
  const [saveState, saveAction, saving] = useActionState(
    saveContentAction,
    null,
  );
  const [generating, startGenerating] = useTransition();
  const [generatingExcerpt, startGeneratingExcerpt] = useTransition();
  const [reviewing, startReviewing] = useTransition();
  const [applyingChanges, startApplyingChanges] = useTransition();
  const [review, setReview] = useState<{
    changes: ArticleContentChange[];
    references: ArticleReference[];
  }>();
  const [generateError, setGenerateError] = useState<string>();

  useEffect(() => {
    function closeActionMenu(event: PointerEvent) {
      const menu = actionMenuRef.current;

      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      )
        menu.open = false;
    }

    function closeActionMenuFromEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && actionMenuRef.current?.open) {
        actionMenuRef.current.open = false;
        actionMenuRef.current.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeActionMenu);
    document.addEventListener("keydown", closeActionMenuFromEscape);

    return () => {
      document.removeEventListener("pointerdown", closeActionMenu);
      document.removeEventListener("keydown", closeActionMenuFromEscape);
    };
  }, []);

  function apply(result: Awaited<ReturnType<typeof generateContentAction>>) {
    setGenerateError(result?.error);
    const proposal = result?.proposal?.content;
    if (
      proposal &&
      (content === article.content ||
        window.confirm("Replace your unsaved MDX with the AI proposal?"))
    ) {
      setContent(proposal);
      setReferences(result?.proposal?.references ?? []);
    }
  }
  function generate() {
    if (actionMenuRef.current) actionMenuRef.current.open = false;

    startGenerating(async () =>
      apply(await generateContentAction(null, actionData(article))),
    );
  }
  function reviewImprovements() {
    if (actionMenuRef.current) actionMenuRef.current.open = false;

    startReviewing(async () => {
      const result = await reviewContentAction(
        null,
        actionData(article, { content }),
      );

      setGenerateError(result?.error);

      if (result?.review) setReview(result.review);
    });
  }

  function applyChanges(changes: ArticleContentChange[]) {
    startApplyingChanges(async () => {
      const result = await applyContentChangesAction(
        null,
        actionData(article, {
          content,
          changes: JSON.stringify(changes),
        }),
      );

      setGenerateError(result?.error);

      if (result?.proposal?.content) {
        setContent(result.proposal.content);
        setReferences((current) => {
          const combined = [...current, ...(review?.references ?? [])];

          return combined.filter(
            (reference, index) =>
              combined.findIndex((item) => item.url === reference.url) ===
              index,
          );
        });
        setReview(undefined);
      }
    });
  }

  function generateExcerpt() {
    startGeneratingExcerpt(async () => {
      const result = await generateExcerptAction(
        null,
        actionData(article, { content }),
      );

      setGenerateError(result?.error);

      if (result?.proposal?.excerpt) setExcerpt(result.proposal.excerpt);
    });
  }

  return (
    <form action={saveAction} className="flex min-h-0 flex-1 flex-col gap-3">
      <ActionNotice
        error={saveState?.error ?? generateError}
        saved={saveState?.saved}
      />
      <Fields article={article} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-medium">Content</h2>
        <div className="flex flex-wrap items-center gap-2">
          <ReferenceMenu references={references} />
          <div className="join">
            <button
              className="btn btn-outline btn-sm join-item"
              disabled={generating || reviewing || applyingChanges}
              onClick={generate}
              type="button"
            >
              {generating ? "Generating…" : "Generate content"}
            </button>
            <details
              className="dropdown dropdown-end join-item"
              ref={actionMenuRef}
            >
              <summary
                aria-label="Choose content action"
                className="btn btn-outline btn-sm join-item px-2"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m7 10 5 5 5-5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </summary>
              <ul className="menu dropdown-content bg-base-100 border-base-300 z-30 mt-1 w-56 border p-2 shadow-lg">
                <li>
                  <button
                    disabled={generating || reviewing || applyingChanges}
                    onClick={generate}
                    type="button"
                  >
                    Generate content
                  </button>
                </li>
                <li>
                  <button
                    disabled={
                      generating ||
                      reviewing ||
                      applyingChanges ||
                      !content.trim()
                    }
                    onClick={reviewImprovements}
                    type="button"
                  >
                    {reviewing ? "Reviewing…" : "Review improvements"}
                  </button>
                </li>
              </ul>
            </details>
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving…" : "Save content"}
          </button>
        </div>
      </div>
      <input name="content" type="hidden" value={content} />
      <input
        name="references"
        type="hidden"
        value={JSON.stringify(references)}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 min-[105rem]:grid min-[105rem]:grid-cols-[minmax(0,1fr)_20rem] min-[105rem]:grid-rows-[minmax(0,1fr)]">
        <div className="flex h-full min-h-0 min-w-0 overflow-hidden">
          <MarkdownEditor
            onChange={setContent}
            placeholder="Write the article…"
            value={content}
          />
        </div>
        <aside className="min-[105rem]:rounded-box min-[105rem]:border-base-300 min-[105rem]:bg-base-200/40 order-first grid shrink-0 gap-3 md:grid-cols-2 min-[105rem]:order-last min-[105rem]:block min-[105rem]:space-y-4 min-[105rem]:border min-[105rem]:p-4">
          <label className="fieldset min-w-0">
            <span className="fieldset-legend">Title</span>
            <textarea
              className="textarea [field-sizing:content] min-h-28 w-full resize-none overflow-hidden"
              maxLength={200}
              name="title"
              onChange={(event) =>
                setTitle(event.target.value.replace(/\s*\n+\s*/g, " "))
              }
              required
              rows={2}
              value={title}
            />
          </label>
          <fieldset className="fieldset min-w-0">
            <div className="flex min-h-6 items-center justify-between gap-3">
              <label className="fieldset-legend" htmlFor="article-excerpt">
                Excerpt
              </label>
              <button
                className="btn btn-ghost btn-xs"
                disabled={generatingExcerpt || !content.trim()}
                onClick={generateExcerpt}
                type="button"
              >
                {generatingExcerpt ? "Generating…" : "Generate with AI"}
              </button>
            </div>
            <textarea
              className="textarea [field-sizing:content] min-h-64 w-full resize-none overflow-hidden"
              id="article-excerpt"
              maxLength={500}
              name="excerpt"
              onChange={(event) => setExcerpt(event.target.value)}
              required
              rows={4}
              value={excerpt}
            />
          </fieldset>
        </aside>
      </div>
      {review ? (
        <ContentImprovementDialog
          applying={applyingChanges}
          changes={review.changes}
          onApply={applyChanges}
          onDismiss={() => setReview(undefined)}
        />
      ) : null}
    </form>
  );
}

function SeoEditor({
  article,
  canonicalBaseUrl,
  projectTopics,
}: {
  article: Article;
  canonicalBaseUrl: string | null;
  projectTopics: string[];
}) {
  const [slug, setSlug] = useState(
    article.slug ?? slugifyArticleTitle(article.title ?? ""),
  );
  const [state, action, pending] = useActionState(saveSeoAction, null);
  return (
    <form action={action} className="flex min-h-0 flex-1 flex-col gap-3">
      <ActionNotice error={state?.error} saved={state?.saved} />
      <Fields article={article} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-medium">SEO</h2>
        <button
          className="btn btn-primary btn-sm"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving…" : "Save SEO"}
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1">
        <div className="grid items-start gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <label className="fieldset">
              <span className="fieldset-legend">Slug</span>
              <input
                className="input w-full"
                maxLength={160}
                name="slug"
                onChange={(event) => setSlug(event.target.value)}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                required
                value={slug}
              />
            </label>
            <p className="text-base-content/60 text-sm break-all">
              URL:{" "}
              {canonicalBaseUrl
                ? `${canonicalBaseUrl}/${article.locale}/blog/${slug || "…"}`
                : "Set the project's canonical base URL to preview the final URL."}
            </p>
          </div>
          <ArticleTopicPicker
            initialTopics={article.topics}
            options={projectTopics}
          />
        </div>
        <label className="fieldset">
          <span className="fieldset-legend">
            SEO title{" "}
            <span className="font-normal opacity-60">
              (typically around 50–60 characters)
            </span>
          </span>
          <input
            className="input w-full"
            defaultValue={article.seoTitle ?? article.title ?? ""}
            maxLength={200}
            name="seoTitle"
            required
          />
        </label>
        <label className="fieldset">
          <span className="fieldset-legend">
            SEO description{" "}
            <span className="font-normal opacity-60">
              (typically around 150–160 characters)
            </span>
          </span>
          <textarea
            className="textarea w-full"
            defaultValue={article.seoDescription ?? article.excerpt ?? ""}
            maxLength={500}
            name="seoDescription"
            required
          />
        </label>
      </div>
    </form>
  );
}

function TranslationEditor({
  article,
  translations,
}: {
  article: Article;
  translations: Translation[];
}) {
  const initial = translations[0];
  const [locale, setLocale] = useState(initial?.locale ?? "vi-VN");
  const selected = translations.find((item) => item.locale === locale);
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
  });
  const [saveState, saveAction, saving] = useActionState(
    saveTranslationAction,
    null,
  );
  const [generating, startGenerating] = useTransition();
  const [generateError, setGenerateError] = useState<string>();
  function generate() {
    startGenerating(async () => {
      const result = await generateTranslationAction(
        null,
        actionData(article, { locale }),
      );
      setGenerateError(result?.error);
      const proposal = result?.proposal;
      if (
        proposal &&
        window.confirm("Replace the translation editor with the AI proposal?")
      )
        setValues({
          title: proposal.title ?? "",
          slug: proposal.slug ?? "",
          excerpt: proposal.excerpt ?? "",
          content: proposal.content ?? "",
          seoTitle: proposal.seoTitle ?? "",
          seoDescription: proposal.seoDescription ?? "",
        });
    });
  }
  function choose(next: string) {
    setLocale(next);
    const item = translations.find(
      (translation) => translation.locale === next,
    );
    setValues({
      title: item?.title ?? "",
      slug: item?.slug ?? "",
      excerpt: item?.excerpt ?? "",
      content: item?.content ?? "",
      seoTitle: item?.seoTitle ?? "",
      seoDescription: item?.seoDescription ?? "",
    });
  }
  return (
    <form action={saveAction} className="flex min-h-0 flex-1 flex-col gap-3">
      <ActionNotice
        error={saveState?.error ?? generateError}
        saved={saveState?.saved}
      />
      <Fields article={article} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-medium">Translations</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving…" : "Save translation"}
          </button>
          <button
            className="btn btn-outline btn-sm"
            disabled={generating}
            onClick={generate}
            type="button"
          >
            {generating ? "Generating…" : "Generate proposal"}
          </button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 gap-4 overflow-auto xl:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] xl:overflow-hidden">
        <div className="min-h-0 space-y-4 xl:overflow-y-auto xl:pr-1">
          <div className="flex flex-wrap items-end gap-3">
            <label className="fieldset">
              <span className="fieldset-legend">Target locale</span>
              <input
                className="input"
                name="locale"
                onChange={(event) => choose(event.target.value)}
                pattern="[a-z]{2,3}(-[A-Z]{2})?"
                required
                value={locale}
              />
            </label>
            {selected ? (
              <span
                className={`badge mb-3 ${selected.status === "approved" ? "badge-success" : "badge-ghost"}`}
              >
                {selected.status}
              </span>
            ) : (
              <span className="text-base-content/60 mb-3 text-sm">
                New draft translation
              </span>
            )}
          </div>
          {(
            ["title", "slug", "excerpt", "seoTitle", "seoDescription"] as const
          ).map((name) => (
            <label className="fieldset" key={name}>
              <span className="fieldset-legend">
                {name === "seoTitle"
                  ? "SEO title"
                  : name === "seoDescription"
                    ? "SEO description"
                    : name[0]!.toUpperCase() + name.slice(1)}
              </span>
              <input
                className="input w-full"
                maxLength={
                  name === "slug"
                    ? 160
                    : name === "excerpt" || name === "seoDescription"
                      ? 500
                      : 200
                }
                name={name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
                pattern={name === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
                required
                value={values[name]}
              />
            </label>
          ))}
        </div>
        <div className="flex min-h-[24rem] flex-col xl:min-h-0">
          <input name="content" type="hidden" value={values.content} />
          <MarkdownEditor
            onChange={(content) =>
              setValues((current) => ({ ...current, content }))
            }
            placeholder="Write the translated article…"
            value={values.content}
          />
        </div>
      </div>
    </form>
  );
}

export function ArticleWorkspace({
  article: sourceArticle,
  projectId,
  step,
  canonicalBaseUrl,
  projectTopics,
  translations,
  publishPreview,
}: {
  article: Article;
  projectId: string;
  step: Step;
  canonicalBaseUrl: string | null;
  projectTopics: string[];
  translations: Translation[];
  publishPreview?: React.ReactNode;
}) {
  const article = { ...sourceArticle, projectId } as Article;
  const unlocked = {
    plan: true,
    content: Boolean(article.plan && article.title),
    seo: Boolean(article.title && article.excerpt && article.content),
    translations: true,
    publish: true,
  };
  const base = `/admin/projects/${projectId}/articles/${article.articleId}`;
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      {article.status === "published" ? (
        <div className="alert alert-warning">
          <span>
            This article is published. Every saved edit becomes public
            immediately.
          </span>
        </div>
      ) : null}
      <div className="tabs tabs-border shrink-0 overflow-x-auto">
        {steps.map((item) =>
          unlocked[item.id] ? (
            <Link
              className={`tab ${step === item.id ? "tab-active" : ""}`}
              href={`${base}?step=${item.id}`}
              key={item.id}
            >
              {item.label}
            </Link>
          ) : (
            <span className="tab cursor-not-allowed opacity-40" key={item.id}>
              {item.label}
            </span>
          ),
        )}
      </div>
      <section className="card card-border bg-base-100 min-h-0 flex-1 overflow-hidden">
        <div className="card-body min-h-0 gap-4 p-5 md:p-7">
          {step === "plan" ? (
            <PlanEditor article={article} />
          ) : step === "content" ? (
            <ContentEditor article={article} />
          ) : step === "seo" ? (
            <SeoEditor
              article={article}
              canonicalBaseUrl={canonicalBaseUrl}
              projectTopics={projectTopics}
            />
          ) : step === "translations" ? (
            <TranslationEditor article={article} translations={translations} />
          ) : (
            publishPreview
          )}
        </div>
      </section>
    </div>
  );
}
