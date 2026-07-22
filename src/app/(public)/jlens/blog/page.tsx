import { defaultLocale } from "@/config/supported-locales";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";
import { JlensBlogIndexPage } from "@/public-site/sites/jlens/blog-index-page";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const values = await searchParams;
  return createBlogIndexMetadata(
    jlensBlogConfig,
    defaultLocale,
    Boolean(first(values.topic) || first(values.cursor)),
  );
}

export default async function JlensBlogRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const values = await searchParams;
  return (
    <JlensBlogIndexPage
      locale={defaultLocale}
      topic={first(values.topic)}
      cursor={first(values.cursor)}
    />
  );
}
