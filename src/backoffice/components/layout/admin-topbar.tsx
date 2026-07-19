"use client";

export function AdminTopbar({
  onOpenNavigation,
}: {
  onOpenNavigation: () => void;
}) {
  return (
    <header className="border-base-300 bg-base-100 flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
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
      <div className="flex min-w-0 flex-1 items-center" id="admin-page-title" />
    </header>
  );
}
