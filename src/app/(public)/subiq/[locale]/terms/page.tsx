import { notFound } from "next/navigation";
import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import {
  EnglishLegalNotice,
  SubiqStaticPageLayout,
} from "@/public-site/sites/subiq/static-page-layout";
import { SubiqTermsPage } from "@/public-site/sites/subiq/terms-page";

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
  return createSubiqStaticPageMetadata("terms", resolve((await params).locale));
}
export default async function LocalizedTermsRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <SubiqStaticPageLayout locale={locale}>
      <EnglishLegalNotice locale={locale} />
      <SubiqTermsPage />
    </SubiqStaticPageLayout>
  );
}
