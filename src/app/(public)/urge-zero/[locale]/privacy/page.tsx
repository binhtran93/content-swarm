import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import UrgeZeroPrivacyPage from "@/public-site/sites/urge-zero/privacy-page";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";
import {
  UrgeZeroEnglishLegalNotice,
  UrgeZeroStaticPageLayout,
} from "@/public-site/sites/urge-zero/static-page-layout";

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
  return createUrgeZeroStaticPageMetadata(
    "privacy",
    resolve((await params).locale),
  );
}
export default async function LocalizedPrivacyRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <UrgeZeroStaticPageLayout locale={locale}>
      <UrgeZeroEnglishLegalNotice locale={locale} />
      <UrgeZeroPrivacyPage locale={locale} />
    </UrgeZeroStaticPageLayout>
  );
}
