import Link from "next/link";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createEnglishSupportPageContent,
  EnglishSupportPage,
  SupportPage,
} from "./support-page";

describe("SupportPage", () => {
  it("creates a complete support page from the common English defaults", () => {
    render(
      <EnglishSupportPage
        productName="Example App"
        companyName="Example Company"
        supportEmail="help@example.com"
        privacyHref="/privacy"
        termsHref="/terms"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Support" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Support" })).toHaveAttribute(
      "href",
      "mailto:help@example.com?subject=Example%20App%20support%20request",
    );
    expect(screen.getByText("Send these details to")).toBeInTheDocument();
    expect(screen.getByText("Report an Issue")).toBeInTheDocument();
    const deletionSection = screen
      .getByRole("heading", { level: 2, name: "Account and Data Deletion" })
      .closest("section");
    expect(deletionSection).not.toBeNull();
    expect(
      within(deletionSection!).getByRole("link", { name: "help@example.com" }),
    ).toHaveAttribute(
      "href",
      "mailto:help@example.com?subject=Example%20App%20deletion%20request",
    );
    expect(screen.getByText("Feature Requests")).toBeInTheDocument();
    expect(screen.getByText("Example Company")).toBeInTheDocument();
    expect(screen.queryByText("Troubleshooting")).not.toBeInTheDocument();
  });

  it("accepts translated copy and optional project sections", () => {
    const content = createEnglishSupportPageContent({
      productName: "Example App",
      companyName: "Example Company",
      supportEmail: "help@example.com",
      privacyHref: "/privacy",
      termsHref: "/terms",
    });
    content.title = "Ayuda";
    content.legal.content = <Link href="/privacidad">Privacidad</Link>;
    content.sections = [
      {
        id: "deletion",
        title: "Delete your data",
        content: <p>Open Settings and choose Delete.</p>,
      },
    ];

    render(<SupportPage supportEmail="help@example.com" content={content} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Ayuda" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Delete your data")).toBeInTheDocument();
    expect(screen.queryByText("Feature Requests")).not.toBeInTheDocument();
  });
});
