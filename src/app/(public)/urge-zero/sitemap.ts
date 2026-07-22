import { buildUrgeZeroSitemap } from "@/public-site/seo/build-urge-zero-sitemap.server";

export const dynamic = "force-dynamic";

export default function sitemap() {
  return buildUrgeZeroSitemap();
}
