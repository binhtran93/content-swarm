import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { ThemedTopLoader } from "@/app/themed-top-loader";

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
        <ThemedTopLoader
          dedicatedSubiq={
            process.env.PUBLIC_ROUTE_MODE === "root" &&
            process.env.PUBLIC_PROJECT_ID === "subiq"
          }
        />
        {children}
      </body>
    </html>
  );
}
