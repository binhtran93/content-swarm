import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["archiver", "sharp"],
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
