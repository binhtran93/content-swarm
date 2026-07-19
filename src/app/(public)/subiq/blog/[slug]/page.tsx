import { notFound } from "next/navigation";

import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { SubiqBlogArticlePage } from "@/public-site/sites/subiq/blog-article-page";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";

export const dynamic = "force-dynamic";
type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const value = await createBlogArticleMetadata(
    subiqBlogConfig,
    "en-US",
    (await params).slug,
  );
  return value ?? notFound();
}

export default async function SubiqBlogArticleRoute({ params }: RouteProps) {
  return <SubiqBlogArticlePage locale="en-US" slug={(await params).slug} />;
}
