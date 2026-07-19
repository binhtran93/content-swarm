import type { SupportedLocaleCode } from "@/config/supported-locales";
import messages from "@/public-site/i18n/messages/en-US.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: SupportedLocaleCode;
    Messages: typeof messages;
  }
}
