import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";

import "@mdxeditor/editor/style.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANMISOFT",
  description: "ANMISOFT content platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
