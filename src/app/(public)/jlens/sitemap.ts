import { buildJlensSitemap } from "@/public-site/seo/build-jlens-sitemap.server";

export const dynamic = "force-dynamic";

export default function sitemap() {
  return buildJlensSitemap();
}
