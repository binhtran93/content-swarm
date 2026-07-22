import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";
import { getLocalizedUrgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";
import { UrgeZeroBlogIndexPage } from "@/public-site/sites/urge-zero/blog-index-page";

export const dynamic = "force-dynamic";
type Props = {
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
export async function generateMetadata({ params, searchParams }: Props) {
  const [route, query] = await Promise.all([params, searchParams]);
  const locale = localeOf(route.locale);
  return createBlogIndexMetadata(
    getLocalizedUrgeZeroBlogConfig(locale),
    locale,
    Boolean(first(query.topic) || first(query.cursor)),
  );
}
export default async function LocalizedUrgeZeroBlogRoute({
  params,
  searchParams,
}: Props) {
  const [route, query] = await Promise.all([params, searchParams]);
  return (
    <UrgeZeroBlogIndexPage
      locale={localeOf(route.locale)}
      topic={first(query.topic)}
      cursor={first(query.cursor)}
    />
  );
}
