import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { getJlensMessages } from "@/public-site/sites/jlens/i18n/get-jlens-translator";
import {
  getLocalizedJlensConfig,
  jlensSiteConfig,
} from "@/public-site/sites/jlens/site-config";

const defaultMessages = getJlensMessages(defaultLocale);

export const jlensBlogConfig: PublicBlogConfig = {
  ...jlensSiteConfig,
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

export function getLocalizedJlensBlogConfig(
  locale: SupportedLocaleCode,
): PublicBlogConfig {
  const messages = getJlensMessages(locale);
  return {
    ...jlensBlogConfig,
    ...getLocalizedJlensConfig(locale),
    blog: {
      ...jlensBlogConfig.blog,
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
