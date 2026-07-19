import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { joinWaitlistAction } from "@/features/waitlist/public/join-waitlist-action.server";
import {
  AcquisitionActions,
  AcquisitionProvider,
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
      projectId="example"
      scopeClassName="example-site"
      siteKey=""
      waitlist={waitlist}
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
