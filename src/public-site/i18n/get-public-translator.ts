import { createTranslator } from "next-intl";

import messages from "@/public-site/i18n/messages/en-US.json";

export function getPublicTranslator() {
  return createTranslator({ locale: "en-US", messages });
}
