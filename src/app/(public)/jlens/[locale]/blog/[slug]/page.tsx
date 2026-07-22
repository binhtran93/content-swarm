import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { JlensBlogArticlePage } from "@/public-site/sites/jlens/blog-article-page";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";

export const dynamic = "force-dynamic";
type RouteProps = { params: Promise<{ locale: string; slug: string }> };
function localeOf(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === defaultLocale) notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params }: RouteProps) {
  const route = await params;
  const value = await createBlogArticleMetadata(
    jlensBlogConfig,
    localeOf(route.locale),
    route.slug,
  );
  return value ?? notFound();
}
export default async function LocalizedJlensArticleRoute({
  params,
}: RouteProps) {
  const route = await params;
  return (
    <JlensBlogArticlePage locale={localeOf(route.locale)} slug={route.slug} />
  );
}
