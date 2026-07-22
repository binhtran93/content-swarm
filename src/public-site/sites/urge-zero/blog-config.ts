import type { PublicBlogConfig } from "@/public-site/config/blog-config";
import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { getUrgeZeroMessages } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import {
  getLocalizedUrgeZeroConfig,
  urgeZeroSiteConfig,
} from "@/public-site/sites/urge-zero/site-config";

const defaultMessages = getUrgeZeroMessages(defaultLocale);

export const urgeZeroBlogConfig: PublicBlogConfig = {
  ...urgeZeroSiteConfig,
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

export function getLocalizedUrgeZeroBlogConfig(
  locale: SupportedLocaleCode,
): PublicBlogConfig {
  const messages = getUrgeZeroMessages(locale);
  return {
    ...urgeZeroBlogConfig,
    ...getLocalizedUrgeZeroConfig(locale),
    blog: {
      ...urgeZeroBlogConfig.blog,
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
