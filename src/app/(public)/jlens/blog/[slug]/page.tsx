import { notFound } from "next/navigation";

import { defaultLocale } from "@/config/supported-locales";
import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";
import { JlensBlogArticlePage } from "@/public-site/sites/jlens/blog-article-page";

export const dynamic = "force-dynamic";

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const value = await createBlogArticleMetadata(
    jlensBlogConfig,
    defaultLocale,
    (await params).slug,
  );
  return value ?? notFound();
}

export default async function JlensBlogArticleRoute({ params }: RouteProps) {
  return (
    <JlensBlogArticlePage locale={defaultLocale} slug={(await params).slug} />
  );
}
