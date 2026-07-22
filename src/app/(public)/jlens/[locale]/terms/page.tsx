import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";
import {
  JlensEnglishLegalNotice,
  JlensStaticPageLayout,
} from "@/public-site/sites/jlens/static-page-layout";
import JewelryIdentifierTermsPage from "@/public-site/sites/jlens/terms-page";

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
  return createJlensStaticPageMetadata("terms", resolve((await params).locale));
}
export default async function LocalizedTermsRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <JlensStaticPageLayout locale={locale}>
      <JlensEnglishLegalNotice locale={locale} />
      <JewelryIdentifierTermsPage locale={locale} />
    </JlensStaticPageLayout>
  );
}
