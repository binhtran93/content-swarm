import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";
import JewelryIdentifierPrivacyPage from "@/public-site/sites/jlens/privacy-page";
import {
  JlensEnglishLegalNotice,
  JlensStaticPageLayout,
} from "@/public-site/sites/jlens/static-page-layout";

type Props = { params: Promise<{ locale: string }> };
function resolve(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === defaultLocale) notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params }: Props) {
  return createJlensStaticPageMetadata(
    "privacy",
    resolve((await params).locale),
  );
}
export default async function LocalizedPrivacyRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <JlensStaticPageLayout locale={locale}>
      <JlensEnglishLegalNotice locale={locale} />
      <JewelryIdentifierPrivacyPage locale={locale} />
    </JlensStaticPageLayout>
  );
}
