import { notFound } from "next/navigation";

import { requireSupportedLocale } from "@/config/supported-locales";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";
import { SubiqBlogIndexPage } from "@/public-site/sites/subiq/blog-index-page";

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
    if (locale === "en-US") notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params, searchParams }: RouteProps) {
  const [route, query] = await Promise.all([params, searchParams]);
  return createBlogIndexMetadata(
    subiqBlogConfig,
    localeOf(route.locale),
    Boolean(first(query.topic) || first(query.cursor)),
  );
}
export default async function LocalizedSubiqBlogRoute({
  params,
  searchParams,
}: RouteProps) {
  const [route, query] = await Promise.all([params, searchParams]);
  return (
    <SubiqBlogIndexPage
      locale={localeOf(route.locale)}
      topic={first(query.topic)}
      cursor={first(query.cursor)}
    />
  );
}
