import type { ReactNode } from "react";

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-base-content/60 mt-1">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
