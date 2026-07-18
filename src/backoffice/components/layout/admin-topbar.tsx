"use client";

import { SignOutButton } from "@/features/auth/backoffice/sign-out-button";

export function AdminTopbar({
  email,
  onOpenNavigation,
}: {
  email?: string;
  onOpenNavigation: () => void;
}) {
  return (
    <header className="border-base-300 bg-base-100 flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <button
        aria-label="Open navigation"
        className="btn btn-ghost btn-sm btn-square lg:hidden"
        onClick={onOpenNavigation}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <div className="ml-auto flex items-center gap-3">
        {email ? (
          <span className="text-base-content/60 hidden text-sm sm:block">
            {email}
          </span>
        ) : null}
        <SignOutButton />
      </div>
    </header>
  );
}
