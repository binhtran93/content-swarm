import { notFound } from "next/navigation";

import { defaultLocale } from "@/config/supported-locales";
import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";
import { UrgeZeroBlogArticlePage } from "@/public-site/sites/urge-zero/blog-article-page";

export const dynamic = "force-dynamic";

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const value = await createBlogArticleMetadata(
    urgeZeroBlogConfig,
    defaultLocale,
    (await params).slug,
  );
  return value ?? notFound();
}

export default async function UrgeZeroBlogArticleRoute({ params }: RouteProps) {
  return (
    <UrgeZeroBlogArticlePage
      locale={defaultLocale}
      slug={(await params).slug}
    />
  );
}
