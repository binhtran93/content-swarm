import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/backoffice/login-form";
import { getSafeAdminNextPath } from "@/features/auth/server/get-safe-admin-next-path";
import { requireOwner } from "@/features/auth/server/require-owner.server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  try {
    await requireOwner();
    redirect("/admin/projects");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String(error.digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
  }

  const nextPath = getSafeAdminNextPath((await searchParams).next);
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="card bg-base-100 border-base-300 w-full max-w-md border shadow-xl shadow-slate-950/5">
        <div className="card-body p-7 sm:p-9">
          <p className="text-primary text-sm font-bold tracking-[0.18em]">
            ANMISOFT
          </p>
          <div className="mb-2">
            <h1 className="text-2xl font-semibold">Owner sign in</h1>
            <p className="text-base-content/60 mt-1 text-sm">
              Access the private publishing backoffice.
            </p>
          </div>
          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}
