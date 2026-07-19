import { notFound } from "next/navigation";

import { requireSupportedLocale } from "@/config/supported-locales";
import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { SubiqBlogArticlePage } from "@/public-site/sites/subiq/blog-article-page";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";

export const dynamic = "force-dynamic";
type RouteProps = { params: Promise<{ locale: string; slug: string }> };
function localeOf(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === "en-US") notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params }: RouteProps) {
  const route = await params;
  const value = await createBlogArticleMetadata(
    subiqBlogConfig,
    localeOf(route.locale),
    route.slug,
  );
  return value ?? notFound();
}
export default async function LocalizedSubiqArticleRoute({
  params,
}: RouteProps) {
  const route = await params;
  return (
    <SubiqBlogArticlePage locale={localeOf(route.locale)} slug={route.slug} />
  );
}
