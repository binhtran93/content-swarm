import { notFound } from "next/navigation";
import { requireSupportedLocale } from "@/config/supported-locales";
import { createSubiqStaticPageMetadata } from "@/public-site/seo/static-page-seo";
import { SubiqPrivacyPage } from "@/public-site/sites/subiq/privacy-page";
import { SubiqStaticPageLayout } from "@/public-site/sites/subiq/static-page-layout";

type Props = { params: Promise<{ locale: string }> };
function resolve(value: string) {
  try {
    const locale = requireSupportedLocale(value).locale;
    if (locale === "en-US") notFound();
    return locale;
  } catch {
    notFound();
  }
}
export async function generateMetadata({ params }: Props) {
  return createSubiqStaticPageMetadata(
    "privacy",
    resolve((await params).locale),
  );
}
export default async function LocalizedPrivacyRoute({ params }: Props) {
  const locale = resolve((await params).locale);
  return (
    <SubiqStaticPageLayout locale={locale}>
      <SubiqPrivacyPage />
    </SubiqStaticPageLayout>
  );
}
