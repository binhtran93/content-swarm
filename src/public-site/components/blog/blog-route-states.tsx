import Link from "next/link";

import styles from "./blog.module.css";

export function BlogLoadingState() {
  return (
    <main className={styles.routeState} aria-busy="true" aria-live="polite">
      <p>Loading guides…</p>
    </main>
  );
}

export function BlogErrorState({ reset }: { reset: () => void }) {
  return (
    <main className={styles.routeState}>
      <h1>We couldn’t load the guides</h1>
      <p>Please try again. Your request did not change any content.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

export function BlogNotFoundState({ blogHref }: { blogHref: string }) {
  return (
    <main className={styles.routeState}>
      <h1>Guide not found</h1>
      <p>This guide may have moved or is no longer published.</p>
      <Link href={blogHref}>Browse all guides</Link>
    </main>
  );
}
