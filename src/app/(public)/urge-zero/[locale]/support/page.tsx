import { notFound } from "next/navigation";

import {
  defaultLocale,
  requireSupportedLocale,
} from "@/config/supported-locales";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";
import { UrgeZeroStaticPageLayout } from "@/public-site/sites/urge-zero/static-page-layout";
import { UrgeZeroSupportPage } from "@/public-site/sites/urge-zero/support-page";

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
    "support",
    resolve((await params).locale),
  );
}
export default async function LocalizedSupportRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <UrgeZeroStaticPageLayout locale={locale} activeNavigationHref="/support">
      <UrgeZeroSupportPage locale={locale} />
    </UrgeZeroStaticPageLayout>
  );
}
