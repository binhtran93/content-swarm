import { BlogNotFoundState } from "@/public-site/components/blog/blog-route-states";
import { getProjectRoutePrefix } from "@/public-site/config/public-url";
import { urgeZeroBlogConfig } from "@/public-site/sites/urge-zero/blog-config";

export default function NotFound() {
  return (
    <BlogNotFoundState
      blogHref={`${getProjectRoutePrefix(urgeZeroBlogConfig)}/blog`}
    />
  );
}
