"use client";

import { useFormStatus } from "react-dom";

export function PendingSubmitButton({
  className,
  disabled = false,
  label,
  pendingLabel,
}: {
  className: string;
  disabled?: boolean;
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={disabled || pending} type="submit">
      {pending ? <span className="loading loading-spinner loading-sm" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}
