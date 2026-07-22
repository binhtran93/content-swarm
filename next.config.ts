import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/jewelry-identifier",
        destination: "https://jlensapp.com/",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/support",
        destination: "https://jlensapp.com/support",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/privacy",
        destination: "https://jlensapp.com/privacy",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/terms",
        destination: "https://jlensapp.com/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
