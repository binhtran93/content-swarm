import type { Metadata } from "next";
import Link from "next/link";

import { worldClockSiteConfig } from "@/public-site/sites/world-clock/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | World Clock Plus",
  description: "Privacy policy for the World Clock Plus mobile app.",
};

const sectionClassName = "mb-8";
const headingClassName = "mb-3 text-2xl font-semibold";
const copyClassName = "leading-8 text-zinc-700";
const listClassName = "list-disc space-y-2 pl-6 leading-8 text-zinc-700";

export default function WorldClockPrivacyPage() {
  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600">
          Last updated: 1 September 2026
        </p>

        <p className={`mb-6 ${copyClassName}`}>
          This Privacy Policy explains how ANMISOFT handles information when you
          use the World Clock Plus mobile app or contact support. The app
          provides world clocks, alarms, widgets, time comparison, and calendar
          event preparation for iOS and Android.
        </p>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Information the app handles</h2>
          <ul className={listClassName}>
            <li>
              <strong>Account information:</strong> World Clock Plus creates an
              anonymous Firebase account identifier to operate app services. If
              you choose Continue with Google, Google and Firebase provide the
              account identifier and basic profile information associated with
              that sign-in, such as your email address and display name.
            </li>
            <li>
              <strong>Clock and preference data:</strong> selected cities, clock
              layout, time-format, appearance, and display preferences are
              stored on your device.
            </li>
            <li>
              <strong>Alarm data:</strong> alarm times, city names, labels,
              repeat schedules, and snooze choices are stored on your device and
              used to schedule local alerts.
            </li>
            <li>
              <strong>Purchases:</strong> subscription status, product and
              entitlement information, transaction status, and an app account
              identifier are processed to offer, complete, and restore
              purchases. ANMISOFT does not receive your full payment-card
              details.
            </li>
            <li>
              <strong>Analytics and diagnostics:</strong> Firebase Analytics may
              process app interactions, app and device information, approximate
              location derived from network information, and the app account
              identifier to understand use and improve reliability.
            </li>
            <li>
              <strong>Support messages:</strong> if you email support, we
              receive your email address and the information you choose to
              include.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Device permissions and features</h2>
          <ul className={listClassName}>
            <li>
              <strong>Notifications and alarms:</strong> the app requests
              permission when needed to deliver alarms you create. Alarm
              notifications are scheduled locally on your device.
            </li>
            <li>
              <strong>Calendar:</strong> when you choose to create an event, the
              app opens a system event editor with details you selected. You
              review and save the event yourself. The app does not read your
              calendar contents.
            </li>
            <li>
              <strong>Widgets:</strong> selected clock information is shared
              with the app&apos;s own widgets on your device so they can display
              the clocks you configure.
            </li>
            <li>
              <strong>Clipboard:</strong> the app copies your account identifier
              only when you use the explicit copy action in Settings.
            </li>
          </ul>
          <p className={`mt-4 ${copyClassName}`}>
            World Clock Plus does not request your device location to provide
            city times or sunrise and sunset information. Those features use the
            cities you select and built-in geographic data.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>How information is used</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We use the information described above to:
          </p>
          <ul className={listClassName}>
            <li>provide clocks, alarms, widgets, and calendar workflows;</li>
            <li>
              authenticate app sessions and support optional Google sign-in;
            </li>
            <li>manage premium access and restore purchases;</li>
            <li>
              understand app use, diagnose problems, and improve reliability;
            </li>
            <li>protect the app and related services from misuse; and</li>
            <li>respond when you contact support.</li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Service providers</h2>
          <p className={`mb-3 ${copyClassName}`}>
            Information is shared only as needed for services used by World
            Clock Plus, including:
          </p>
          <ul className={listClassName}>
            <li>
              Google Firebase for authentication, backend services, Analytics,
              and diagnostics;
            </li>
            <li>Google for optional Google sign-in;</li>
            <li>RevenueCat for subscription status and entitlements; and</li>
            <li>
              Apple and Google for app distribution, purchases, refunds, device
              permissions, notifications, calendars, and platform services.
            </li>
          </ul>
          <p className={`mt-4 ${copyClassName}`}>
            These providers process information under their own terms and
            privacy practices. We do not sell personal information, and World
            Clock Plus does not use advertising SDKs to show targeted ads.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Website data</h2>
          <p className={copyClassName}>
            The World Clock Plus Support, Privacy, and Terms pages hosted under
            anmisoft.com do not use Project-specific website analytics. The web
            server may process ordinary request information, such as IP address,
            browser type, requested page, and request time, for delivery,
            security, and operational logging.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Retention and deletion</h2>
          <p className={copyClassName}>
            Clock selections, alarms, and preferences remain on your device
            until you change them, clear app data, or uninstall the app. Cloud
            account, analytics, purchase, security, and support records are
            retained only as long as needed to provide the relevant service,
            maintain required business and security records, resolve disputes,
            and meet legal obligations. To request deletion of an account or
            personal data associated with World Clock Plus, email
            support@anmisoft.com. We may need your account identifier and may
            ask you to verify ownership. Deletion does not cancel a subscription
            managed by Apple or Google, and those providers may retain records
            under their own requirements.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Your choices</h2>
          <p className={copyClassName}>
            You can choose whether to sign in with Google, grant notification or
            calendar access, create alarms, or save calendar events. Device
            permissions can be changed in system settings. Depending on where
            you live, you may also have rights to access, correct, delete, or
            receive a copy of personal information we hold about you. Contact
            support to make a request.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Security</h2>
          <p className={copyClassName}>
            We use reasonable administrative and technical measures to protect
            information. No method of electronic transmission or storage is
            completely secure, so absolute security cannot be guaranteed.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Children</h2>
          <p className={copyClassName}>
            World Clock Plus is not directed to children under 13, and we do not
            knowingly collect personal information from children under 13. If
            you believe a child has provided personal information, contact us so
            we can review and remove it as appropriate.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Changes to this policy</h2>
          <p className={copyClassName}>
            We may update this policy when World Clock Plus, our service
            providers, or applicable requirements change. The date at the top
            identifies the latest published version.
          </p>
        </section>

        <section>
          <h2 className={headingClassName}>Contact</h2>
          <p className={copyClassName}>
            For privacy questions or requests, email support@anmisoft.com or
            visit the{" "}
            <Link
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              href={`${worldClockSiteConfig.basePath}/support`}
            >
              World Clock Plus support page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
