import { BlogNotFoundState } from "@/public-site/components/blog/blog-route-states";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";

export default function NotFound() {
  return (
    <BlogNotFoundState
      blogHref={`${getProjectRoutePrefix(jlensBlogConfig)}/blog`}
    />
  );
}
