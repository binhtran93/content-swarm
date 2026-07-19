"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOutOwner } from "@/features/auth/client/sign-out-owner";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      className={`btn btn-ghost btn-sm ${className}`}
      disabled={submitting}
      onClick={async () => {
        setSubmitting(true);
        try {
          await signOutOwner();
        } finally {
          router.replace("/login");
          router.refresh();
        }
      }}
      type="button"
    >
      {submitting ? "Signing out…" : "Sign out"}
    </button>
  );
}
