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
  generateContentAction,
  generatePlanAction,
  generateTranslationAction,
  improveContentAction,
  saveContentAction,
  savePlanAction,
  saveSeoAction,
  saveTranslationAction,
} from "@/features/articles/backoffice/article-actions.server";
import { MarkdownEditor } from "@/features/articles/backoffice/markdown-editor";
import type { ArticleReference } from "@/features/articles/model/article-reference";
import type { Article } from "@/features/articles/model/article";
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
  const [title, setTitle] = useState(article.title ?? "");
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
        proposal?.title &&
        proposal.plan &&
        ((title === article.title && plan === article.plan) ||
          window.confirm(
            "Replace your unsaved article plan with the AI proposal?",
          ))
      ) {
        setTitle(proposal.title);
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
        <label className="fieldset shrink-0">
          <span className="fieldset-legend">Article title</span>
          <input
            className="input w-full"
            maxLength={200}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            required
            value={title}
          />
        </label>
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
  const [content, setContent] = useState(article.content ?? "");
  const [references, setReferences] = useState(article.contentReferences);
  const [saveState, saveAction, saving] = useActionState(
    saveContentAction,
    null,
  );
  const [generating, startGenerating] = useTransition();
  const [improving, startImproving] = useTransition();
  const [generateError, setGenerateError] = useState<string>();
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
    startGenerating(async () =>
      apply(await generateContentAction(null, actionData(article))),
    );
  }
  function improve() {
    startImproving(async () =>
      apply(await improveContentAction(null, actionData(article))),
    );
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
        <div className="flex flex-wrap gap-2">
          <ReferenceMenu references={references} />
          <button
            className="btn btn-primary btn-sm"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving…" : "Save content"}
          </button>
          <button
            className="btn btn-outline btn-sm"
            disabled={generating}
            onClick={generate}
            type="button"
          >
            {generating ? "Generating…" : "Generate content"}
          </button>
          <button
            className="btn btn-outline btn-sm"
            disabled={improving || !article.content}
            onClick={improve}
            type="button"
          >
            {improving ? "Improving…" : "Improve saved content"}
          </button>
        </div>
      </div>
      <input name="content" type="hidden" value={content} />
      <input
        name="references"
        type="hidden"
        value={JSON.stringify(references)}
      />
      <MarkdownEditor
        onChange={setContent}
        placeholder="Write the article…"
        value={content}
      />
    </form>
  );
}

function SeoEditor({
  article,
  canonicalBaseUrl,
}: {
  article: Article;
  canonicalBaseUrl: string | null;
}) {
  const [slug, setSlug] = useState(article.slug ?? "");
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
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="fieldset">
            <span className="fieldset-legend">Title</span>
            <input
              className="input w-full"
              defaultValue={article.title ?? ""}
              maxLength={200}
              name="title"
              required
            />
          </label>
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
        </div>
        <p className="text-base-content/60 text-sm break-all">
          URL:{" "}
          {canonicalBaseUrl
            ? `${canonicalBaseUrl}/${article.locale}/blog/${slug || "…"}`
            : "Set the project's canonical base URL to preview the final URL."}
        </p>
        <label className="fieldset">
          <span className="fieldset-legend">Topic</span>
          <input
            className="input w-full"
            defaultValue={article.topic ?? ""}
            maxLength={300}
            name="topic"
            required
          />
        </label>
        <label className="fieldset">
          <span className="fieldset-legend">
            Excerpt <span className="font-normal opacity-60">(up to 500)</span>
          </span>
          <textarea
            className="textarea w-full"
            defaultValue={article.excerpt ?? ""}
            maxLength={500}
            name="excerpt"
            required
          />
        </label>
        <label className="fieldset">
          <span className="fieldset-legend">
            SEO title{" "}
            <span className="font-normal opacity-60">
              (typically around 50–60 characters)
            </span>
          </span>
          <input
            className="input w-full"
            defaultValue={article.seoTitle ?? ""}
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
            defaultValue={article.seoDescription ?? ""}
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
  translations,
  publishPreview,
}: {
  article: Article;
  projectId: string;
  step: Step;
  canonicalBaseUrl: string | null;
  translations: Translation[];
  publishPreview?: React.ReactNode;
}) {
  const article = { ...sourceArticle, projectId } as Article;
  const unlocked = {
    plan: true,
    content: Boolean(article.plan && article.title),
    seo: Boolean(article.content),
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
            <SeoEditor article={article} canonicalBaseUrl={canonicalBaseUrl} />
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
