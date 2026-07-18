export function LoadingState() {
  return (
    <div aria-label="Loading" className="space-y-4" role="status">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-32 w-full" />
    </div>
  );
}
