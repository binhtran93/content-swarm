import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";
import { getLocalizedJlensBlogConfig } from "@/public-site/sites/jlens/blog-config";
import { JlensBlogIndexPage } from "@/public-site/sites/jlens/blog-index-page";

export const dynamic = "force-dynamic";
type RouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
function localeOf(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === defaultLocale) notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params, searchParams }: RouteProps) {
  const [route, query] = await Promise.all([params, searchParams]);
  const locale = localeOf(route.locale);
  return createBlogIndexMetadata(
    getLocalizedJlensBlogConfig(locale),
    locale,
    Boolean(first(query.topic) || first(query.cursor)),
  );
}
export default async function LocalizedJlensBlogRoute({
  params,
  searchParams,
}: RouteProps) {
  const [route, query] = await Promise.all([params, searchParams]);
  return (
    <JlensBlogIndexPage
      locale={localeOf(route.locale)}
      topic={first(query.topic)}
      cursor={first(query.cursor)}
    />
  );
}
