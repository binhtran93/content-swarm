import { SubiqBlogIndexPage } from "@/public-site/sites/subiq/blog-index-page";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";
import { createBlogIndexMetadata } from "@/public-site/seo/blog-index-seo";

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
    subiqBlogConfig,
    "en-US",
    Boolean(first(values.topic) || first(values.cursor)),
  );
}

export default async function SubiqBlogRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const values = await searchParams;
  return (
    <SubiqBlogIndexPage
      locale="en-US"
      topic={first(values.topic)}
      cursor={first(values.cursor)}
    />
  );
}
