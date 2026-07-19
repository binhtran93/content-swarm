import { BlogNotFoundState } from "@/public-site/components/blog/blog-route-states";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";

export default function NotFound() {
  return (
    <BlogNotFoundState
      blogHref={`${getProjectRoutePrefix(subiqBlogConfig)}/blog`}
    />
  );
}
