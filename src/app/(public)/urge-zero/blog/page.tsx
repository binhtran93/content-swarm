import { defaultLocale } from "@/config/supported-locales";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";
import { UrgeZeroBlogIndexPage } from "@/public-site/sites/urge-zero/blog-index-page";

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
    urgeZeroBlogConfig,
    defaultLocale,
    Boolean(first(values.topic) || first(values.cursor)),
  );
}

export default async function UrgeZeroBlogRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const values = await searchParams;
  return (
    <UrgeZeroBlogIndexPage
      locale={defaultLocale}
      cursor={first(values.cursor)}
      topic={first(values.topic)}
    />
  );
}
