import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@mdxeditor/editor/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANMISOFT",
  description: "ANMISOFT content platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
