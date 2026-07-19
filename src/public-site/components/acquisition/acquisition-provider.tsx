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
  projectId: string;
  scopeClassName: string;
  siteKey: string;
  waitlist: PublicSiteConfig["waitlist"];
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
        <span>{context.waitlist.emailLabel}</span>
        <input
          autoComplete="email"
          autoFocus
          inputMode="email"
          maxLength={254}
          name="email"
          placeholder={context.waitlist.emailPlaceholder}
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
          The waitlist is not configured yet.
        </p>
      )}
      {state && !state.ok ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className={styles.submit}
        disabled={pending || !context.siteKey}
        type="submit"
      >
        {pending ? "Joining…" : context.waitlist.submitLabel}
      </button>
      <p className={styles.consent}>
        By joining, you agree to receive launch emails from {context.brandName}.{" "}
        <Link href={request.privacyHref}>Privacy Policy</Link>
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
            aria-label="Close waitlist"
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
            <h2 id="waitlist-success-title">{context.waitlist.successTitle}</h2>
            <p>{context.waitlist.successDescription}</p>
            <button
              autoFocus
              className={styles.submit}
              onClick={() => dialog.current?.close()}
              type="button"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="waitlist-dialog-title">{context.waitlist.title}</h2>
            <p className={styles.description}>{context.waitlist.description}</p>
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
  projectId,
  scopeClassName,
  siteKey,
  waitlist,
}: {
  acquisition: ProjectAcquisition;
  brandName: string;
  children: ReactNode;
  projectId: string;
  scopeClassName: string;
  siteKey: string;
  waitlist: PublicSiteConfig["waitlist"];
}) {
  const [request, setRequest] = useState<WaitlistRequest | null>(null);
  const context: AcquisitionContextValue = {
    acquisition,
    brandName,
    projectId,
    scopeClassName,
    siteKey,
    waitlist,
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
  ariaLabel = "App availability",
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
  if (context.acquisition.mode === "waitlist") {
    return (
      <button
        className={`${styles.primaryCta} ${className ?? ""}`}
        onClick={() => context.openWaitlist({ source, locale, privacyHref })}
        type="button"
      >
        {context.waitlist.ctaLabel}
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
      aria-label={ariaLabel}
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
  return context.acquisition.mode === "waitlist" ? (
    <button
      className={className}
      onClick={() =>
        context.openWaitlist({ source: "header", locale, privacyHref })
      }
      type="button"
    >
      {context.waitlist.ctaLabel}
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
