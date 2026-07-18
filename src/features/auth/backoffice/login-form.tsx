"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { signInOwner } from "@/features/auth/client/sign-in-owner";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      await signInOwner(
        String(form.get("email")),
        String(form.get("password")),
      );
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to sign in. Check your credentials and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <label className="form-control block">
        <span className="label-text mb-2 block text-sm font-medium">Email</span>
        <input
          autoComplete="email"
          className="input input-bordered w-full"
          disabled={submitting}
          name="email"
          required
          type="email"
        />
      </label>
      <label className="form-control block">
        <span className="label-text mb-2 block text-sm font-medium">
          Password
        </span>
        <input
          autoComplete="current-password"
          className="input input-bordered w-full"
          disabled={submitting}
          minLength={6}
          name="password"
          required
          type="password"
        />
      </label>
      {error ? (
        <p className="text-error text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="btn btn-primary w-full"
        disabled={submitting}
        type="submit"
      >
        {submitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : null}
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
