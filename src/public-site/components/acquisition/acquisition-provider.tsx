"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  createContext,
  type ReactNode,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import type { ProjectAcquisition } from "@/features/projects/model/project-acquisition";
import type { JoinWaitlistResult } from "@/features/waitlist/model/waitlist-signup";
import { joinWaitlistAction } from "@/features/waitlist/public/join-waitlist-action.server";
import type {
  PublicSiteConfig,
  SiteStoreBadge,
} from "@/public-site/config/site-config";

import styles from "./acquisition.module.css";

export type AcquisitionPresentation = {
  waitlist: PublicSiteConfig["waitlist"];
  availability: string;
  submitting: string;
  done: string;
  close: string;
  notConfigured: string;
  genericError: string;
  consent: string;
  privacyPolicy: string;
};

type WaitlistRequest = {
  key: number;
  source: "header" | "hero" | "final" | "blog";
  locale: SupportedLocaleCode;
  privacyHref: string;
};

type TurnstileApi = {
  render: (
    target: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      appearance: "interaction-only";
      responseField: boolean;
      responseFieldName: string;
      size: "flexible";
      theme: "light";
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type AcquisitionContextValue = {
  acquisition: ProjectAcquisition;
  brandName: string;
  defaultLocale: SupportedLocaleCode;
  projectId: string;
  scopeClassName: string;
  siteKey: string;
  presentations: Readonly<
    Partial<Record<SupportedLocaleCode, AcquisitionPresentation>>
  >;
  openWaitlist: (request: Omit<WaitlistRequest, "key">) => void;
};

const AcquisitionContext = createContext<AcquisitionContextValue | null>(null);

function useAcquisition() {
  const value = useContext(AcquisitionContext);
  if (!value) {
    throw new Error("Acquisition components require AcquisitionProvider.");
  }
  return value;
}

function getAcquisitionPresentation(
  context: AcquisitionContextValue,
  locale: SupportedLocaleCode,
) {
  const presentation =
    context.presentations[locale] ??
    context.presentations[context.defaultLocale];
  if (!presentation) {
    throw new Error(
      `AcquisitionProvider requires a presentation for its default locale (${context.defaultLocale}).`,
    );
  }
  return presentation;
}

function WaitlistForm({
  action,
  context,
  pending,
  request,
  state,
}: {
  action: (formData: FormData) => void;
  context: AcquisitionContextValue;
  pending: boolean;
  request: WaitlistRequest;
  state: JoinWaitlistResult | null;
}) {
  const copy = getAcquisitionPresentation(context, request.locale);
  const [scriptReady, setScriptReady] = useState(false);
  const turnstileContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptReady || !context.siteKey || !turnstileContainer.current) return;
    const turnstile = window.turnstile;
    if (!turnstile) return;
    const widgetId = turnstile.render(turnstileContainer.current, {
      sitekey: context.siteKey,
      action: "waitlist_signup",
      appearance: "interaction-only",
      responseField: true,
      responseFieldName: "cf-turnstile-response",
      size: "flexible",
      theme: "light",
    });
    return () => turnstile.remove(widgetId);
  }, [context.siteKey, scriptReady]);

  return (
    <form action={action} className={styles.form}>
      <input name="projectId" type="hidden" value={context.projectId} />
      <input name="locale" type="hidden" value={request.locale} />
      <input name="source" type="hidden" value={request.source} />
      <label>
        <span>{copy.waitlist.emailLabel}</span>
        <input
          autoComplete="email"
          autoFocus
          inputMode="email"
          maxLength={254}
          name="email"
          placeholder={copy.waitlist.emailPlaceholder}
          required
          type="email"
        />
      </label>
      <label className={styles.honeypot} aria-hidden="true">
        Website
        <input autoComplete="off" name="website" tabIndex={-1} />
      </label>
      {context.siteKey ? (
        <>
          <Script
            id="cloudflare-turnstile"
            onReady={() => setScriptReady(true)}
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
          <div className={styles.turnstile} ref={turnstileContainer} />
        </>
      ) : (
        <p className={styles.error} role="alert">
          {copy.notConfigured}
        </p>
      )}
      {state && !state.ok ? (
        <p className={styles.error} role="alert">
          {copy.genericError}
        </p>
      ) : null}
      <button
        className={styles.submit}
        disabled={pending || !context.siteKey}
        type="submit"
      >
        {pending ? copy.submitting : copy.waitlist.submitLabel}
      </button>
      <p className={styles.consent}>
        {copy.consent}{" "}
        <Link href={request.privacyHref}>{copy.privacyPolicy}</Link>
      </p>
    </form>
  );
}

function WaitlistDialog({
  context,
  request,
  onClose,
}: {
  context: AcquisitionContextValue;
  request: WaitlistRequest;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<
    JoinWaitlistResult | null,
    FormData
  >(joinWaitlistAction, null);
  const succeeded = state?.ok === true;
  const copy = getAcquisitionPresentation(context, request.locale);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      aria-labelledby={
        succeeded ? "waitlist-success-title" : "waitlist-dialog-title"
      }
      className={`${styles.dialog} ${context.scopeClassName}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onClose={onClose}
      ref={dialog}
    >
      <div className={styles.dialogPanel}>
        {!succeeded ? (
          <button
            aria-label={copy.close}
            className={styles.close}
            onClick={() => dialog.current?.close()}
            type="button"
          >
            ×
          </button>
        ) : null}
        {succeeded ? (
          <div className={styles.success} role="status">
            <span aria-hidden="true">✓</span>
            <h2 id="waitlist-success-title">{copy.waitlist.successTitle}</h2>
            <p>{copy.waitlist.successDescription}</p>
            <button
              autoFocus
              className={styles.submit}
              onClick={() => dialog.current?.close()}
              type="button"
            >
              {copy.done}
            </button>
          </div>
        ) : (
          <>
            <h2 id="waitlist-dialog-title">{copy.waitlist.title}</h2>
            <p className={styles.description}>{copy.waitlist.description}</p>
            <WaitlistForm
              action={action}
              context={context}
              pending={pending}
              request={request}
              state={state}
            />
          </>
        )}
      </div>
    </dialog>
  );
}

export function AcquisitionProvider({
  acquisition,
  brandName,
  children,
  defaultLocale,
  projectId,
  scopeClassName,
  siteKey,
  presentations,
}: {
  acquisition: ProjectAcquisition;
  brandName: string;
  children: ReactNode;
  defaultLocale: SupportedLocaleCode;
  projectId: string;
  scopeClassName: string;
  siteKey: string;
  presentations: Readonly<
    Partial<Record<SupportedLocaleCode, AcquisitionPresentation>>
  >;
}) {
  const [request, setRequest] = useState<WaitlistRequest | null>(null);
  const context: AcquisitionContextValue = {
    acquisition,
    brandName,
    defaultLocale,
    projectId,
    scopeClassName,
    siteKey,
    presentations,
    openWaitlist: (next) => setRequest({ ...next, key: Date.now() }),
  };
  return (
    <AcquisitionContext.Provider value={context}>
      {children}
      {request ? (
        <WaitlistDialog
          context={context}
          key={request.key}
          request={request}
          onClose={() => setRequest(null)}
        />
      ) : null}
    </AcquisitionContext.Provider>
  );
}

function storeUrl(
  acquisition: ProjectAcquisition,
  platform: SiteStoreBadge["platform"],
) {
  return platform === "appStore"
    ? acquisition.appStoreUrl
    : acquisition.googlePlayUrl;
}

export function AcquisitionActions({
  ariaLabel,
  badges,
  className,
  locale,
  privacyHref,
  source,
}: {
  ariaLabel?: string;
  badges: readonly SiteStoreBadge[];
  className?: string;
  locale: SupportedLocaleCode;
  privacyHref: string;
  source: WaitlistRequest["source"];
}) {
  const context = useAcquisition();
  const copy = getAcquisitionPresentation(context, locale);
  if (context.acquisition.mode === "waitlist") {
    return (
      <button
        className={`${styles.primaryCta} ${className ?? ""}`}
        onClick={() => context.openWaitlist({ source, locale, privacyHref })}
        type="button"
      >
        {copy.waitlist.ctaLabel}
      </button>
    );
  }
  const available = badges.flatMap((badge) => {
    const href = storeUrl(context.acquisition, badge.platform);
    return href ? [{ badge, href }] : [];
  });
  return (
    <div
      className={`${styles.storeBadges} ${className ?? ""}`}
      aria-label={ariaLabel ?? copy.availability}
    >
      {available.map(({ badge, href }) => (
        <a
          aria-label={badge.label}
          className={styles.storeLink}
          href={href}
          key={badge.platform}
          rel="noreferrer"
          target="_blank"
        >
          <Image
            alt=""
            className={styles.storeBadge}
            height={badge.height}
            src={badge.imageSrc}
            width={badge.width}
          />
        </a>
      ))}
    </div>
  );
}

export function AcquisitionHeaderCta({
  className,
  href,
  locale,
  privacyHref,
  storeLabel,
}: {
  className: string;
  href: string;
  locale: SupportedLocaleCode;
  privacyHref: string;
  storeLabel: string;
}) {
  const context = useAcquisition();
  const copy = getAcquisitionPresentation(context, locale);
  return context.acquisition.mode === "waitlist" ? (
    <button
      className={className}
      onClick={() =>
        context.openWaitlist({ source: "header", locale, privacyHref })
      }
      type="button"
    >
      {copy.waitlist.ctaLabel}
    </button>
  ) : (
    <Link className={className} href={href}>
      {storeLabel}
    </Link>
  );
}

export function AcquisitionSectionCopy({
  storesDescription,
  storesTitle,
  waitlistDescription,
  waitlistTitle,
}: {
  storesDescription: string;
  storesTitle: ReactNode;
  waitlistDescription: string;
  waitlistTitle: ReactNode;
}) {
  const { acquisition } = useAcquisition();
  return (
    <>
      <h2>{acquisition.mode === "waitlist" ? waitlistTitle : storesTitle}</h2>
      <p>
        {acquisition.mode === "waitlist"
          ? waitlistDescription
          : storesDescription}
      </p>
    </>
  );
}
