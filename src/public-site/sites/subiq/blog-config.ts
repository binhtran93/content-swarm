import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { getSubiqMessages } from "@/public-site/sites/subiq/i18n/get-subiq-translator";
import {
  getLocalizedSubiqConfig,
  subiqSiteConfig,
} from "@/public-site/sites/subiq/site-config";

const defaultMessages = getSubiqMessages(defaultLocale);

export const subiqBlogConfig: PublicBlogConfig = {
  ...subiqSiteConfig,
  blog: {
    titleLead: defaultMessages.blog.titleLead,
    titleAccent: defaultMessages.blog.titleAccent,
    description: defaultMessages.blog.description,
    postsPerPage: 10,
    installCta: {
      eyebrow: defaultMessages.blog.installEyebrow,
      title: defaultMessages.blog.installTitle,
      description: defaultMessages.blog.installDescription,
    },
  },
};

export function getLocalizedSubiqBlogConfig(
  locale: SupportedLocaleCode,
): PublicBlogConfig {
  const messages = getSubiqMessages(locale);
  return {
    ...subiqBlogConfig,
    ...getLocalizedSubiqConfig(locale),
    blog: {
      ...subiqBlogConfig.blog,
      titleLead: messages.blog.titleLead,
      titleAccent: messages.blog.titleAccent,
      description: messages.blog.description,
      installCta: {
        eyebrow: messages.blog.installEyebrow,
        title: messages.blog.installTitle,
        description: messages.blog.installDescription,
      },
    },
  };
}
