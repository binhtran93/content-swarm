import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

export const urgeZeroBlogConfig: PublicBlogConfig = {
  ...urgeZeroSiteConfig,
  blog: {
    titleLead: "Help with",
    titleAccent: "urges",
    description:
      "Tips for handling urges, building better habits, and getting back on track.",
    postsPerPage: 10,
    installCta: {
      eyebrow: "Be ready for the moment",
      title: "Put a plan within reach with UrgeZero",
      description:
        "Use breathing, focus tools, streak tracking, Coach, and community support when an urge feels difficult",
    },
  },
};
