import type { PublicSiteConfig } from "@/public-site/config/site-config";

export type PublicBlogConfig = PublicSiteConfig & {
  blog: {
    titleLead: string;
    titleAccent: string;
    description: string;
    postsPerPage: number;
    installCta: {
      eyebrow: string;
      title: string;
      description: string;
    };
  };
};
