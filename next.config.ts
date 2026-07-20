import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/jewelry-identifier/privacy",
        destination: "/jlens/privacy",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/terms",
        destination: "/jlens/terms",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/support",
        destination: "/jlens/support",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (process.env.PUBLIC_ROUTE_MODE !== "root") return [];
    return {
      beforeFiles: [
        { source: "/blog/:path*", destination: "/subiq/blog/:path*" },
        { source: "/support", destination: "/subiq/support" },
        { source: "/privacy", destination: "/subiq/privacy" },
        { source: "/terms", destination: "/subiq/terms" },
        { source: "/favicon.png", destination: "/subiq/favicon.png" },
        { source: "/sitemap.xml", destination: "/subiq/sitemap.xml" },
        { source: "/robots.txt", destination: "/subiq/robots.txt" },
        {
          source:
            "/:locale(ar-SA|cs-CZ|de-DE|es-ES|fr-FR|hi-IN|id-ID|it-IT|ja-JP|ko-KR|nl-NL|pl-PL|pt-BR|pt-PT|ro-RO|sv-SE|th-TH|tr-TR|vi-VN|zh-Hant-TW)/:path*",
          destination: "/subiq/:locale/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
