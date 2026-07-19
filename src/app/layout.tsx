import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
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
      <body>
        <NextTopLoader
          color="#167bff"
          height={3}
          shadow="0 0 8px rgba(22, 123, 255, 0.45)"
          showSpinner={false}
          zIndex={9999}
        />
        {children}
      </body>
    </html>
  );
}
