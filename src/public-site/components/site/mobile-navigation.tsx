"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { SiteNavigationItem } from "@/public-site/config/site-config";

import styles from "./site-shell.module.css";

type MobileNavigationItem = SiteNavigationItem & {
  active: boolean;
};

export function MobileNavigation({
  items,
  label,
  languageSelector,
}: {
  items: readonly MobileNavigationItem[];
  label: string;
  languageSelector?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.mobileNavigation} ref={rootRef}>
      <button
        aria-controls="mobile-primary-navigation"
        aria-expanded={open}
        aria-label={label}
        className={styles.menuButton}
        onClick={() => setOpen((value) => !value)}
        ref={buttonRef}
        type="button"
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      {open ? (
        <nav
          aria-label={label}
          className={styles.mobileMenu}
          id="mobile-primary-navigation"
        >
          {items.map((item) => {
            const navigationProps = {
              "aria-current": item.active ? ("page" as const) : undefined,
              className: item.active ? styles.activeMobileNav : undefined,
              onClick: () => setOpen(false),
            };

            return item.href.includes("#") ? (
              <a
                href={item.href}
                key={`${item.label}-${item.href}`}
                {...navigationProps}
              >
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                href={item.href}
                key={`${item.label}-${item.href}`}
                {...navigationProps}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          {languageSelector ? (
            <div className={styles.mobileMenuLanguage}>{languageSelector}</div>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
