"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { AdminNavigationItem } from "@/backoffice/config/navigation";

const icons: Record<AdminNavigationItem["icon"], ReactNode> = {
  projects: (
    <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h4l2 2h9A1.5 1.5 0 0 1 21 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
  ),
  keywords: (
    <path d="M10.5 4a6.5 6.5 0 1 0 4.8 10.88L20 19.59 21.41 18l-4.58-4.58A6.5 6.5 0 0 0 10.5 4m0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9" />
  ),
  articles: <path d="M6 3h9l4 4v14H6zm8 2v4h4M9 13h7M9 17h7" />,
};

export function AdminMenuItem({
  item,
  active,
  onNavigate,
}: {
  item: AdminNavigationItem;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        aria-current={active ? "page" : undefined}
        className={active ? "active" : undefined}
        href={item.href}
        onClick={onNavigate}
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          {icons[item.icon]}
        </svg>
        {item.label}
      </Link>
    </li>
  );
}
