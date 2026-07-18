export function ErrorToast({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="toast toast-top toast-end z-100" role="alert">
      <div className="alert alert-error max-w-md shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );
}
