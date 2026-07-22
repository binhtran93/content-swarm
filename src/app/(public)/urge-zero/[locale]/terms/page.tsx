import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";
import {
  UrgeZeroEnglishLegalNotice,
  UrgeZeroStaticPageLayout,
} from "@/public-site/sites/urge-zero/static-page-layout";
import UrgeZeroTermsPage from "@/public-site/sites/urge-zero/terms-page";

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
    "terms",
    resolve((await params).locale),
  );
}
export default async function LocalizedTermsRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <UrgeZeroStaticPageLayout locale={locale}>
      <UrgeZeroEnglishLegalNotice locale={locale} />
      <UrgeZeroTermsPage locale={locale} />
    </UrgeZeroStaticPageLayout>
  );
}
