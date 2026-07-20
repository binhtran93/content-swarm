"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BR,
  CZ,
  DE,
  ES,
  FR,
  ID,
  IN,
  IT,
  JP,
  KR,
  NL,
  PL,
  PT,
  RO,
  SA,
  SE,
  TH,
  TR,
  TW,
  US,
  VN,
} from "country-flag-icons/react/3x2";

import {
  supportedLocales,
  type SupportedLocaleCode,
} from "@/config/supported-locales";

import styles from "./site-shell.module.css";

const localeFlags = {
  BR,
  CZ,
  DE,
  ES,
  FR,
  ID,
  IN,
  IT,
  JP,
  KR,
  NL,
  PL,
  PT,
  RO,
  SA,
  SE,
  TH,
  TR,
  TW,
  US,
  VN,
};

// Initial market priority based on global web-content language usage. Keep
// regional variants adjacent and replace this heuristic with product analytics
// once there is enough language-selector traffic to rank reliably.
const languageMenuOrder = [
  "en-US",
  "es-ES",
  "de-DE",
  "ja-JP",
  "fr-FR",
  "pt-BR",
  "pt-PT",
  "it-IT",
  "nl-NL",
  "pl-PL",
  "tr-TR",
  "zh-Hant-TW",
  "id-ID",
  "vi-VN",
  "cs-CZ",
  "ko-KR",
  "ar-SA",
  "sv-SE",
  "ro-RO",
  "th-TH",
  "hi-IN",
] as const satisfies readonly SupportedLocaleCode[];
const languageMenuPriority = new Map(
  languageMenuOrder.map((locale, index) => [locale, index] as const),
);

function compactLanguageLabel(locale: SupportedLocaleCode, label: string) {
  if (locale === "pt-BR" || locale === "pt-PT") return label;
  return label.replace(/\s*\([^()]*\)\s*$/u, "");
}

export function LanguageSelector({
  locale,
  defaultLocale,
  enabledLocales,
  routePrefix,
  label,
  articleAlternates,
}: {
  locale: SupportedLocaleCode;
  defaultLocale: SupportedLocaleCode;
  enabledLocales: readonly SupportedLocaleCode[];
  routePrefix: string;
  label: string;
  articleAlternates?: Partial<Record<SupportedLocaleCode, string>>;
}) {
  const [open, setOpen] = useState(false);
  const [fragment, setFragment] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = supportedLocales.find((item) => item.locale === locale)!;
  const CurrentFlag = localeFlags[current.countryCode];

  useEffect(() => {
    const updateFragment = () => setFragment(window.location.hash);
    updateFragment();
    window.addEventListener("hashchange", updateFragment);
    return () => window.removeEventListener("hashchange", updateFragment);
  }, []);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    requestAnimationFrame(() =>
      menuRef.current
        ?.querySelector<HTMLElement>("[aria-checked='true']")
        ?.focus(),
    );
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function hrefFor(target: SupportedLocaleCode) {
    const query = searchParams.size ? `?${searchParams.toString()}` : "";
    if (articleAlternates?.[target])
      return `${articleAlternates[target]}${query}${fragment}`;
    let relative = pathname;
    if (routePrefix && relative.startsWith(routePrefix))
      relative = relative.slice(routePrefix.length) || "/";
    const first = relative.split("/").filter(Boolean)[0];
    const routedLocale = supportedLocales.find((item) => item.locale === first);
    if (routedLocale && routedLocale.locale !== defaultLocale) {
      relative = relative.slice(first.length + 1) || "/";
    }
    const prefix = target === defaultLocale ? "" : `/${target}`;
    return `${routePrefix}${prefix}${relative.startsWith("/") ? relative : `/${relative}`}${query}${fragment}`;
  }

  function moveFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        "[role='menuitemradio']",
      ) ?? [],
    );
    if (!items.length) return;
    event.preventDefault();
    const currentIndex = Math.max(
      0,
      items.indexOf(document.activeElement as HTMLElement),
    );
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (currentIndex + 1) % items.length
            : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex].focus();
  }

  function selectLanguage(
    event: ReactMouseEvent<HTMLAnchorElement>,
    target: SupportedLocaleCode,
  ) {
    const data = document.getElementById(
      "article-language-alternates",
    )?.textContent;
    if (data) {
      try {
        const alternatives = JSON.parse(data) as Partial<
          Record<SupportedLocaleCode, string>
        >;
        if (alternatives[target]) {
          event.preventDefault();
          const query = searchParams.size ? `?${searchParams.toString()}` : "";
          window.location.assign(
            `${alternatives[target]}${query}${window.location.hash}`,
          );
        }
      } catch {
        // The normal locale-preserving link remains the no-script/error fallback.
      }
    }
    setOpen(false);
  }

  const orderedLocaleOptions = supportedLocales
    .filter((item) => enabledLocales.includes(item.locale))
    .sort(
      (left, right) =>
        (languageMenuPriority.get(left.locale) ?? Number.MAX_SAFE_INTEGER) -
        (languageMenuPriority.get(right.locale) ?? Number.MAX_SAFE_INTEGER),
    );

  return (
    <div className={styles.languageSelector} ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className={styles.languageButton}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <CurrentFlag
          className={styles.languageButtonFlag}
          aria-hidden="true"
        />
        <span>{current.languageCode.toUpperCase()}</span>
      </button>
      {open ? (
        <div
          className={styles.languageMenu}
          role="menu"
          aria-label={label}
          ref={menuRef}
          onKeyDown={moveFocus}
        >
          {orderedLocaleOptions.map((item) => {
            const Flag = localeFlags[item.countryCode];

            return (
              <a
                role="menuitemradio"
                aria-checked={item.locale === locale}
                className={
                  item.locale === locale ? styles.activeLanguage : undefined
                }
                dir="ltr"
                href={hrefFor(item.locale)}
                key={item.locale}
                onClick={(event) => selectLanguage(event, item.locale)}
              >
                <Flag className={styles.languageFlag} aria-hidden="true" />
                <span dir={item.direction}>
                  {compactLanguageLabel(item.locale, item.label)}
                </span>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
