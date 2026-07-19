"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function PageTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setTarget(document.getElementById("admin-page-title"));
    });
    return () => {
      active = false;
    };
  }, []);

  if (!target) return null;

  return createPortal(
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>,
    target,
  );
}
