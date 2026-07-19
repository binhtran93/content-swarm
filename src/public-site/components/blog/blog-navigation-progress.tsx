"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import styles from "./blog.module.css";

const START_EVENT = "blog:navigation-start";

function isSameDocumentLink(anchor: HTMLAnchorElement) {
  const destination = new URL(anchor.href, window.location.href);
  return (
    destination.origin === window.location.origin &&
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search
  );
}

export function announceBlogNavigation() {
  window.dispatchEvent(new Event(START_EVENT));
}

export function BlogNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams}`;
  const [state, setState] = useState<"idle" | "loading" | "complete">("idle");

  useEffect(() => {
    const finishTimer = window.setTimeout(() => {
      setState((current) => (current === "loading" ? "complete" : current));
    }, 0);

    return () => window.clearTimeout(finishTimer);
  }, [routeKey]);

  useEffect(() => {
    if (state !== "complete") return;
    const hideTimer = window.setTimeout(() => setState("idle"), 180);
    return () => window.clearTimeout(hideTimer);
  }, [state]);

  useEffect(() => {
    const start = () => setState("loading");

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("href")?.startsWith("#") ||
        isSameDocumentLink(anchor)
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin) start();
    }

    window.addEventListener(START_EVENT, start);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener(START_EVENT, start);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`${styles.navigationProgress} ${
        state === "idle"
          ? ""
          : styles[
              `navigationProgress${state[0].toUpperCase()}${state.slice(1)}`
            ]
      }`}
    />
  );
}
