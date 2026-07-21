import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { joinWaitlistAction } from "@/features/waitlist/public/join-waitlist-action.server";
import {
  AcquisitionActions,
  AcquisitionHeaderCta,
  AcquisitionProvider,
  detectMobileStorePlatform,
} from "@/public-site/components/acquisition";

vi.mock("@/features/waitlist/public/join-waitlist-action.server", () => ({
  joinWaitlistAction: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function (
  this: HTMLDialogElement,
) {
  this.setAttribute("open", "");
});

const waitlist = {
  ctaLabel: "Join waitlist",
  title: "Join the Example waitlist",
  description: "Get an email when Example is available.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  submitLabel: "Join waitlist",
  successTitle: "You’re on the list.",
  successDescription: "We’ll let you know when Example launches.",
};

const badges = [
  {
    platform: "appStore" as const,
    label: "Download on the App Store",
    imageSrc: "/app-store.svg",
    width: 134,
    height: 40,
  },
  {
    platform: "googlePlay" as const,
    label: "Get it on Google Play",
    imageSrc: "/google-play.svg",
    width: 180,
    height: 54,
  },
];

function Subject({
  mode,
  appStoreUrl = null,
  googlePlayUrl = null,
}: {
  mode: "waitlist" | "stores";
  appStoreUrl?: string | null;
  googlePlayUrl?: string | null;
}) {
  return (
    <AcquisitionProvider
      acquisition={{ mode, appStoreUrl, googlePlayUrl }}
      brandName="Example"
      defaultLocale="en-US"
      projectId="example"
      scopeClassName="example-site"
      siteKey=""
      presentations={{
        "en-US": {
          waitlist,
          availability: "App availability",
          submitting: "Joining…",
          done: "Done",
          close: "Close waitlist",
          notConfigured: "The waitlist is not configured yet.",
          genericError: "The waitlist is unavailable.",
          consent:
            "By joining, you agree to receive launch emails from Example.",
          privacyPolicy: "Privacy Policy",
        },
        "vi-VN": {
          waitlist,
          availability: "Tình trạng ứng dụng",
          submitting: "Đang đăng ký…",
          done: "Xong",
          close: "Đóng",
          notConfigured: "Chưa được thiết lập.",
          genericError: "Hiện không khả dụng.",
          consent: "Khi tham gia, bạn đồng ý nhận email.",
          privacyPolicy: "Chính sách quyền riêng tư",
        },
      }}
    >
      <AcquisitionActions
        badges={badges}
        locale="en-US"
        privacyHref="/subiq/privacy"
        source="hero"
      />
    </AcquisitionProvider>
  );
}

function HeaderSubject({
  appStoreUrl = "https://apps.apple.com/us/app/example/id123",
  googlePlayUrl = "https://play.google.com/store/apps/details?id=com.example",
}: {
  appStoreUrl?: string | null;
  googlePlayUrl?: string | null;
}) {
  return (
    <AcquisitionProvider
      acquisition={{ mode: "stores", appStoreUrl, googlePlayUrl }}
      brandName="Example"
      defaultLocale="en-US"
      projectId="example"
      scopeClassName="example-site"
      siteKey=""
      presentations={{
        "en-US": {
          waitlist,
          availability: "App availability",
          submitting: "Joining…",
          done: "Done",
          close: "Close",
          notConfigured: "The waitlist is not configured yet.",
          genericError: "The waitlist is unavailable.",
          consent: "By joining, you agree to receive launch emails.",
          privacyPolicy: "Privacy Policy",
        },
      }}
    >
      <AcquisitionHeaderCta
        badges={badges}
        className="header-cta"
        locale="en-US"
        privacyHref="/privacy"
        storeLabel="Download"
      />
    </AcquisitionProvider>
  );
}

describe("AcquisitionProvider", () => {
  it("replaces store badges with a waitlist dialog trigger", () => {
    render(<Subject mode="waitlist" />);
    fireEvent.click(screen.getByRole("button", { name: "Join waitlist" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/subiq/privacy");
  });

  it("renders only the configured store", () => {
    render(
      <Subject
        mode="stores"
        appStoreUrl="https://apps.apple.com/us/app/subiq/id123"
      />,
    );
    expect(
      screen.getByRole("link", { name: "Download on the App Store" }),
    ).toHaveAttribute("href", "https://apps.apple.com/us/app/subiq/id123");
    expect(
      screen.queryByRole("link", { name: "Get it on Google Play" }),
    ).not.toBeInTheDocument();
  });

  it("shows one scannable QR choice at a time on desktop", () => {
    render(<HeaderSubject />);

    fireEvent.click(screen.getByRole("button", { name: "Download" }));

    expect(
      screen.getByRole("dialog", { name: "App availability" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Download on the App Store" }),
    ).toHaveAttribute("href", "https://apps.apple.com/us/app/example/id123");
    expect(
      screen.queryByRole("link", { name: "Get it on Google Play" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Google Play" }));

    expect(
      screen.getByRole("link", { name: "Get it on Google Play" }),
    ).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=com.example",
    );
    expect(
      screen.queryByRole("link", { name: "Download on the App Store" }),
    ).not.toBeInTheDocument();
  });

  it("shows only the configured store in the QR chooser", () => {
    render(<HeaderSubject googlePlayUrl={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Download" }));

    expect(
      screen.getByRole("link", { name: "Download on the App Store" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Get it on Google Play" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("replaces the signup content with one compact success state", async () => {
    vi.mocked(joinWaitlistAction).mockResolvedValueOnce({ ok: true });
    render(<Subject mode="waitlist" />);
    fireEvent.click(screen.getByRole("button", { name: "Join waitlist" }));

    const form = screen.getByLabelText("Email address").closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "You’re on the list." }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByRole("heading", { name: "Join the Example waitlist" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close waitlist" }),
    ).not.toBeInTheDocument();
  });
});

describe("mobile store detection", () => {
  it("detects Android and iOS phones", () => {
    expect(
      detectMobileStorePlatform({
        maxTouchPoints: 5,
        platform: "Linux armv8l",
        userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9)",
      }),
    ).toBe("googlePlay");
    expect(
      detectMobileStorePlatform({
        maxTouchPoints: 5,
        platform: "iPhone",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      }),
    ).toBe("appStore");
  });

  it("recognizes iPads requesting a desktop site without treating Macs as mobile", () => {
    expect(
      detectMobileStorePlatform({
        maxTouchPoints: 5,
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      }),
    ).toBe("appStore");
    expect(
      detectMobileStorePlatform({
        maxTouchPoints: 0,
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      }),
    ).toBeNull();
  });
});
