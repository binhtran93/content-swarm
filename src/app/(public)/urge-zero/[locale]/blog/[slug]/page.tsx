import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createBlogArticleMetadata } from "@/public-site/seo/blog-seo.server";
import { UrgeZeroBlogArticlePage } from "@/public-site/sites/urge-zero/blog-article-page";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; slug: string }> };
function localeOf(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === defaultLocale) notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params }: Props) {
  const route = await params;
  return (
    (await createBlogArticleMetadata(
      urgeZeroBlogConfig,
      localeOf(route.locale),
      route.slug,
    )) ?? notFound()
  );
}
export default async function LocalizedUrgeZeroArticleRoute({ params }: Props) {
  const route = await params;
  return (
    <UrgeZeroBlogArticlePage
      locale={localeOf(route.locale)}
      slug={route.slug}
    />
  );
}
