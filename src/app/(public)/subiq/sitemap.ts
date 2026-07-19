import { buildSubiqSitemap } from "@/public-site/seo/build-subiq-sitemap.server";

export const dynamic = "force-dynamic";

export default function sitemap() {
  return buildSubiqSitemap();
}
