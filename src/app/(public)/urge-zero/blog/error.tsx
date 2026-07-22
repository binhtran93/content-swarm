"use client";

import { BlogErrorState } from "@/public-site/components/blog/blog-route-states";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <BlogErrorState reset={reset} />;
}
