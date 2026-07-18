"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { AdminSidebar } from "@/backoffice/components/layout/admin-sidebar";
import { AdminTopbar } from "@/backoffice/components/layout/admin-topbar";

export function AdminShell({
  children,
  ownerEmail,
  projectId,
}: {
  children: ReactNode;
  ownerEmail?: string;
  projectId?: string;
}) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const closeNavigation = useCallback(() => setNavigationOpen(false), []);

  return (
    <div className="bg-base-200 min-h-screen lg:pl-64">
      <AdminSidebar
        onClose={closeNavigation}
        open={navigationOpen}
        projectId={projectId}
      />
      <div className="flex min-h-screen min-w-0 flex-col">
        <AdminTopbar
          email={ownerEmail}
          onOpenNavigation={() => setNavigationOpen(true)}
        />
        <main className="grow p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
