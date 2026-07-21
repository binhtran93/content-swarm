import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";

export const jlensBlogConfig: PublicBlogConfig = {
  ...jlensSiteConfig,
  blog: {
    titleLead: "Jewelry knowledge,",
    titleAccent: "made clearer",
    description:
      "Practical guides to identifying, understanding, caring for, and cataloging your jewelry.",
    postsPerPage: 10,
    installCta: {
      eyebrow: "Identify with confidence",
      title: "Take a closer look with JLens",
      description:
        "Use JLens to identify jewelry, understand its details, and keep your collection organized.",
    },
  },
};
