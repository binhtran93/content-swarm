"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { AdminMenuItem } from "@/backoffice/components/layout/admin-menu-item";
import { getAdminNavigation } from "@/backoffice/config/navigation";

export function AdminSidebar({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId?: string;
}) {
  const pathname = usePathname();
  const routeProjectId = pathname.match(/^\/admin\/projects\/([^/]+)/)?.[1];
  const activeProjectId =
    projectId ?? (routeProjectId === "new" ? undefined : routeProjectId);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeButton.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  return (
    <>
      <aside
        aria-label="Admin navigation"
        className={`admin-sidebar ${open ? "admin-sidebar-open" : ""}`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="text-lg font-bold tracking-[0.16em]">ANMISOFT</span>
          <button
            aria-label="Close navigation"
            className="btn btn-ghost btn-sm btn-square lg:hidden"
            onClick={onClose}
            ref={closeButton}
            type="button"
          >
            <span aria-hidden="true" className="text-xl">
              ×
            </span>
          </button>
        </div>
        <nav className="min-h-0 grow overflow-y-auto px-3 py-4">
          <p className="text-base-content/45 px-3 pb-2 text-xs font-semibold tracking-widest uppercase">
            Workspace
          </p>
          <ul className="menu w-full gap-1 p-0">
            {getAdminNavigation(activeProjectId).map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <AdminMenuItem
                  active={active}
                  item={item}
                  key={item.href}
                  onNavigate={onClose}
                />
              );
            })}
          </ul>
        </nav>
      </aside>
      {open ? (
        <button
          aria-label="Close navigation overlay"
          className="admin-sidebar-backdrop"
          onClick={onClose}
          type="button"
        />
      ) : null}
    </>
  );
}
