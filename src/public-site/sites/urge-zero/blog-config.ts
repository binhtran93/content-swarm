import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const urgeZeroBlogConfig: PublicBlogConfig = {
  ...urgeZeroSiteConfig,
  blog: {
    titleLead: "Practical help for",
    titleAccent: "the next choice",
    description:
      "Clear, grounded guides for understanding urges, rebuilding habits, handling setbacks, and continuing forward",
    postsPerPage: 10,
    installCta: {
      eyebrow: "Be ready for the moment",
      title: "Put a plan within reach with UrgeZero",
      description:
        "Use breathing, focus tools, streak tracking, Coach, and community support when an urge feels difficult",
    },
  },
};
