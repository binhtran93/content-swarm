import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";

export const subiqBlogConfig: PublicBlogConfig = {
  ...subiqSiteConfig,
  blog: {
    titleLead: "Understand",
    titleAccent: "what you pay for",
    description:
      "Straightforward guides to finding subscriptions, checking renewals, cutting recurring costs, and navigating cancellations or refunds",
    postsPerPage: 10,
    installCta: {
      eyebrow: "SubIQ",
      title: "Track your subscriptions with SubIQ",
      description:
        "See upcoming renewals, recurring costs, and where each subscription is managed",
    },
  },
};
