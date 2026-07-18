import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/backoffice/components/layout/admin-shell";
import { requireOwner } from "@/features/auth/server/require-owner.server";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let owner;
  try {
    owner = await requireOwner();
  } catch {
    redirect("/login?next=/admin/projects");
  }

  return <AdminShell ownerEmail={owner.email}>{children}</AdminShell>;
}
